import { map } from 'ramda';
import uuid from 'uuid/v4';
import {
  deleteEntityById,
  getById,
  prepareDate,
  dayFormat,
  monthFormat,
  yearFormat,
  notify,
  now,
  paginate,
  takeWriteTx,
  prepareString
} from '../database/grakn';
import { BUS_TOPICS } from '../config/conf';
import { index } from '../database/elasticSearch';

export const findAll = args => paginate('match $org isa Organization', args);

export const findById = organizationId => getById(organizationId);

export const addOrganization = async (user, organization) => {
  const wTx = await takeWriteTx();
  const organizationIterator = await wTx.query(`insert $organization isa Organization,
    has entity_type "organization",
    has stix_id "${
      organization.stix_id
        ? prepareString(organization.stix_id)
        : `organization--${uuid()}`
    }",
    has stix_label "",
    has alias "",
    has name "${prepareString(organization.name)}",
    has description "${prepareString(organization.description)}",
    has created ${
      organization.created ? prepareDate(organization.created) : now()
    },
    has modified ${
      organization.modified ? prepareDate(organization.modified) : now()
    },
    has revoked false,
    has created_at ${now()},
    has created_at_day "${dayFormat(now())}",
    has created_at_month "${monthFormat(now())}",
    has created_at_year "${yearFormat(now())}",         
    has updated_at ${now()};
  `);
  const createOrganization = await organizationIterator.next();
  const createdOrganizationId = await createOrganization
    .map()
    .get('organization').id;

  if (organization.createdByRef) {
    await wTx.query(
      `match $from id ${createdOrganizationId};
      $to id ${organization.createdByRef};
      insert (so: $from, creator: $to)
      isa created_by_ref;`
    );
  }

  if (organization.markingDefinitions) {
    const createMarkingDefinition = markingDefinition =>
      wTx.query(
        `match $from id ${createdOrganizationId}; 
        $to id ${markingDefinition}; 
        insert (so: $from, marking: $to) isa object_marking_refs;`
      );
    const markingDefinitionsPromises = map(
      createMarkingDefinition,
      organization.markingDefinitions
    );
    await Promise.all(markingDefinitionsPromises);
  }

  await wTx.commit();

  return getById(createdOrganizationId).then(created => {
    index('stix-domain-entities', 'stix_domain_entity', created);
    return notify(BUS_TOPICS.StixDomainEntity.ADDED_TOPIC, created, user);
  });
};

export const organizationDelete = organizationId =>
  deleteEntityById(organizationId);
