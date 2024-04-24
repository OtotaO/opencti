import { type BasicStoreEntityDeleteOperation, ENTITY_TYPE_DELETE_OPERATION } from './deleteOperation-types';
import { FunctionalError } from '../../config/errors';
import { elDeleteInstances, elFindByIds } from '../../database/engine';
import { deleteAllObjectFiles } from '../../database/file-storage';
import { listEntitiesPaginated, storeLoadById } from '../../database/middleware-loader';
import { INDEX_DELETED_OBJECTS, isNotEmptyField, READ_INDEX_DELETED_OBJECTS } from '../../database/utils';
import type { QueryDeleteOperationsArgs } from '../../generated/graphql';
import type { AuthContext, AuthUser } from '../../types/user';
import { controlUserConfidenceAgainstElement } from '../../utils/confidence-level';
import { schemaAttributesDefinition } from '../../schema/schema-attributes';
import { schemaRelationsRefDefinition } from '../../schema/schema-relationsRef';
import { createEntity, createRelation } from '../../database/middleware';
import type { BasicStoreObject, BasicStoreRelation } from '../../types/store';
import { isStixRelationship } from '../../schema/stixRelationship';
import { isStixObject } from '../../schema/stixCoreObject';
import { elUpdateRemovedFiles } from '../../database/file-search';
import { logApp } from '../../config/conf';

type CompleteDeleteOptions = {
  isRestoring?: boolean
};

//----------------------------------------------------------------------------------------------------------------------
// Utilities

/**
 * Picks the given keys from an object ; if key does not exist it's ignored
 */
const pick = (object: any, keys: string[] = []) => {
  return keys.reduce((acc, key) => {
    if (isNotEmptyField(object[key])) {
      acc[key] = object[key];
    }
    return acc;
  }, {} as Record<string, any>);
};

const convertStoreEntityToInput = (element: BasicStoreObject) => {
  const { entity_type } = element;
  // forge input from the object in DB, as we want to "create" the element to trigger the full chain of events
  // start with the attributes defined in schema
  const availableAttributes = Array.from(schemaAttributesDefinition.getAttributes(entity_type).values());
  const availableAttributeNames = availableAttributes.map((attr) => attr.name);
  const directInputs = pick(element, availableAttributeNames);

  // We need all refs that have 'From' as the main entity ; we can rely on the schema
  // add refs registered for this type using inverse mapping database name <> attribute name
  // for instance created-by in DB shall be createdBy in the input object
  const availableRefAttributes = schemaRelationsRefDefinition.getRelationsRef(entity_type);
  const availableRefAttributesDatabaseNames = availableRefAttributes.map((attr) => attr.databaseName);
  const refsInElement = pick(element, availableRefAttributesDatabaseNames);
  const refInputs: any = {};
  Object.keys(refsInElement).forEach((refDbName) => {
    const key = schemaRelationsRefDefinition.convertDatabaseNameToInputName(entity_type, refDbName) as string; // cannot be null by design
    refInputs[key] = refsInElement[refDbName];
  });

  if (isStixObject(entity_type)) {
    return {
      ...directInputs,
      ...refInputs
    };
  }
  if (isStixRelationship(entity_type)) {
    const connectionInput = pick(element, ['fromId', 'toId']);
    return {
      ...directInputs,
      ...refInputs,
      ...connectionInput,
    };
  }
  throw FunctionalError('Could not convert element to input for DeleteOperation restore', { entity_type });
};

export const resolveEntitiesToRestore = async (context: AuthContext, user: AuthUser, deleteOperation: BasicStoreEntityDeleteOperation) => {
  // check that the element cluster can be fully restored, throw error otherwise
  const { main_entity_id, main_entity_type, deleted_elements } = deleteOperation;
  const elementsToRestore = await elFindByIds(context, user, deleted_elements.map((deleted) => deleted.id), { indices: [INDEX_DELETED_OBJECTS] }) as BasicStoreObject[];
  const mainElementToRestore = elementsToRestore.find((e) => e.id === main_entity_id);
  const relationshipsToRestore = elementsToRestore.filter((e) => e.id !== main_entity_id);

  // check that we have main elements and all relationships in trash index
  if (!mainElementToRestore || elementsToRestore.length !== deleted_elements.length) {
    throw FunctionalError('Cannot restore : deleted elements not found.');
  }

  // check that all relationships from & to exist (either in live DB or in elementsToRestore)
  const allRelationshipsToRestore = elementsToRestore.filter((e) => isStixRelationship(e.entity_type));
  const targetIdsToFind = []; // targets not found in elements to restore, we will search them in live DB.
  for (let i = 0; i < allRelationshipsToRestore.length; i += 1) {
    const relationship = allRelationshipsToRestore[i] as BasicStoreRelation;
    const { fromId, toId } = relationship;
    if (!elementsToRestore.some((e) => e.id === fromId)) {
      targetIdsToFind.push(fromId);
    }
    if (!elementsToRestore.some((e) => e.id === toId)) {
      targetIdsToFind.push(toId);
    }
  }
  if (targetIdsToFind.length > 0) {
    // the DELETED_OBJECTS index is not read by default ;
    // TODO: handle cascade restore if the item is found in the trash
    const targets = await elFindByIds(context, user, targetIdsToFind, { baseData: true, baseFields: ['internal_id', 'entity_type'] }) as BasicStoreObject[];
    if (targets.length < targetIdsToFind.length) {
      throw FunctionalError('Cannot restore : missing target elements to restore relationships');
    }
  }
  // TODO check that elementsToRestore are not present in live DB (duplicate)
  if (isStixObject(mainElementToRestore.entity_type)) {
    // TODO check that main entity has not been created in the meantime in live DB
  }
  // TODO -> if OK, then return the ordered list of deleted_elements, ready to be restored in the right order

  // filter out the refs registered in the schema for the main entity (they are recreated already  when restoring the main entity)

  const availableRefAttributes = schemaRelationsRefDefinition.getRelationsRef(main_entity_type);
  // availableRefAttributes = [objects, object-label...]
  const availableRefAttributesDatabaseNames = availableRefAttributes.map((attr) => attr.databaseName);
  // availableRefAttributesDatabaseNames = [rel_object, rel_object-label...]

  return {
    mainElementToRestore,
    relationshipsToRestore: relationshipsToRestore.filter((r) => !availableRefAttributesDatabaseNames.includes(r.entity_type))
  };

  // -> filter out only relationships, not refs (handled below directly)
  // -> all relationships point to existing elements (or the ones in the cluster)
  // -> if a relationship points to something missing in Db, but present in the trash, throw explicit error message to indicate
  //    which one (id+representative+entity_type, so frontend can display something useful)
};

//----------------------------------------------------------------------------------------------------------------------

export const findById = async (context: AuthContext, user: AuthUser, id: string) => {
  return storeLoadById<BasicStoreEntityDeleteOperation>(context, user, id, ENTITY_TYPE_DELETE_OPERATION);
};

export const findAll = async (context: AuthContext, user: AuthUser, args: QueryDeleteOperationsArgs) => {
  return listEntitiesPaginated<BasicStoreEntityDeleteOperation>(context, user, [ENTITY_TYPE_DELETE_OPERATION], args);
};

/**
 * Permanently delete a given DeleteOperation and all the elements referenced in it, wherever they are (restored or not).
 */
export const processDeleteOperation = async (context: AuthContext, user: AuthUser, id: string, opts: CompleteDeleteOptions = {}) => {
  const { isRestoring } = opts;
  const deleteOperation = await findById(context, user, id);
  if (!deleteOperation) {
    throw FunctionalError(`Delete operation ${id} cannot be found`);
  }
  controlUserConfidenceAgainstElement(user, deleteOperation);

  const { main_entity_id, deleted_elements } = deleteOperation;
  // get all deleted elements & main deleted entity (from deleted_objects index)
  const mainEntityId = main_entity_id;
  const deletedElementsIds = deleted_elements.map((el) => el.id);
  const deletedElements: any[] = await elFindByIds(context, user, deletedElementsIds, { indices: READ_INDEX_DELETED_OBJECTS }) as any[];
  const mainDeletedEntity = deletedElements.find((el) => el.internal_id === mainEntityId);
  if (mainDeletedEntity && isStixObject(mainDeletedEntity.entity_type)) {
    if (isRestoring) {
      // cluster restored: flag the files available for search again
      await elUpdateRemovedFiles(mainDeletedEntity, false);
    } else {
      // confirm delete: delete associated files permanently
      await deleteAllObjectFiles(context, user, mainDeletedEntity);
    }
  }
  // delete elements
  await elDeleteInstances([...deletedElements]);
  // finally delete deleteOperation
  await elDeleteInstances([deleteOperation]);
  return id;
};

export const confirmDelete = (context: AuthContext, user: AuthUser, id: string) => {
  return processDeleteOperation(context, user, id, { isRestoring: false });
};

export const restoreDelete = async (context: AuthContext, user: AuthUser, id: string) => {
  const deleteOperation = await findById(context, user, id);
  if (!deleteOperation) {
    throw FunctionalError('Cannot find DeleteOperation', { id });
  }
  // check that the element cluster can be fully restored, throw error otherwise
  const { mainElementToRestore, relationshipsToRestore } = await resolveEntitiesToRestore(context, user, deleteOperation);

  // restore main element
  const { main_entity_type } = deleteOperation;
  const mainEntityInput = convertStoreEntityToInput(mainElementToRestore);
  if (isStixObject(mainElementToRestore.entity_type)) {
    await createEntity(context, user, mainEntityInput, main_entity_type);
  } else if (isStixRelationship(mainElementToRestore.entity_type)) {
    await createRelation(context, user, mainEntityInput, main_entity_type);
    // no file associated to relationships
  } else {
    throw FunctionalError('Cannot restore main entity: unhandled entity type', { main_entity_type });
  }

  // restore the relationships, the order is already optimized
  for (let i = 0; i < relationshipsToRestore.length; i += 1) {
    const { entity_type } = relationshipsToRestore[i];
    // we handle also the refs relationship 'to' the main entity (like 'objects' for containers)
    if (isStixRelationship(entity_type)) { // ref, sighting and core
      const relationshipInput = convertStoreEntityToInput(relationshipsToRestore[i]);
      await createRelation(context, user, relationshipInput);
    } else {
      logApp.warn('Could not restore relationship', { entity_type });
    }
  }
  // now delete the DeleteOperation and all the elements in the trash index
  await processDeleteOperation(context, user, id, { isRestoring: true });

  return id;
};
