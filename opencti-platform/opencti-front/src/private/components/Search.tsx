import React from 'react';
import { useParams } from 'react-router-dom';
import { graphql } from 'react-relay';
import {
  SearchStixCoreObjectsLinesPaginationQuery,
  SearchStixCoreObjectsLinesPaginationQuery$variables,
} from '@components/__generated__/SearchStixCoreObjectsLinesPaginationQuery.graphql';
import { SearchStixCoreObjectsLines_data$data } from '@components/__generated__/SearchStixCoreObjectsLines_data.graphql';
} from '@components/search/__generated__/SearchStixCoreObjectsLinesPaginationQuery.graphql';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import EEChip from '@components/common/entreprise_edition/EEChip';
import ListLines from '../../components/list_lines/ListLines';
import ToolBar from './data/ToolBar';
import SearchStixCoreObjectsLines, { searchStixCoreObjectsLinesQuery } from './search/SearchStixCoreObjectsLines';
import ExportContextProvider from '../../utils/ExportContextProvider';
import { usePaginationLocalStorage } from '../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../utils/hooks/useQueryLoading';
import useAuth from '../../utils/hooks/useAuth';
import { useBuildEntityTypeBasedFilterContext, emptyFilterGroup, useGetDefaultFilterObject } from '../../utils/filters/filtersUtils';
import { decodeSearchKeyword } from '../../utils/SearchUtils';
import DataTable from '../../components/dataGrid/DataTable';
import { UsePreloadedPaginationFragment } from '../../utils/hooks/usePreloadedPaginationFragment';

const LOCAL_STORAGE_KEY = 'search';

const searchLineFragment = graphql`
  fragment SearchStixCoreObjectLine_node on StixCoreObject {
    id
    parent_types
    entity_type
    created_at
    ... on AttackPattern {
      name
      description
      aliases
    }
    ... on Campaign {
      name
      description
      aliases
    }
    ... on Note {
      attribute_abstract
      content
    }
    ... on ObservedData {
      name
      first_observed
      last_observed
    }
    ... on Opinion {
      opinion
      explanation
    }
    ... on Report {
      name
      description
    }
    ... on Grouping {
      name
      description
    }
    ... on CourseOfAction {
      name
      description
      x_opencti_aliases
    }
    ... on Individual {
      name
      description
      x_opencti_aliases
    }
    ... on Organization {
      name
      description
      x_opencti_aliases
    }
    ... on Sector {
      name
      description
      x_opencti_aliases
    }
    ... on System {
      name
      description
      x_opencti_aliases
    }
    ... on Indicator {
      name
      description
    }
    ... on Infrastructure {
      name
      description
    }
    ... on IntrusionSet {
      name
      aliases
      description
    }
    ... on Position {
      name
      description
      x_opencti_aliases
    }
    ... on City {
      name
      description
      x_opencti_aliases
    }
    ... on AdministrativeArea {
      name
      description
      x_opencti_aliases
    }
    ... on Country {
      name
      description
      x_opencti_aliases
    }
    ... on Region {
      name
      description
      x_opencti_aliases
    }
    ... on Malware {
      name
      aliases
      description
    }
    ... on ThreatActor {
      name
      aliases
      description
    }
    ... on Tool {
      name
      aliases
      description
    }
    ... on Vulnerability {
      name
      description
    }
    ... on Incident {
      name
      aliases
      description
    }
    ... on Event {
      name
      description
      aliases
    }
    ... on Channel {
      name
      description
      aliases
    }
    ... on Narrative {
      name
      description
      aliases
    }
    ... on Language {
      name
      aliases
    }
    ... on DataComponent {
      name
    }
    ... on DataSource {
      name
    }
    ... on Case {
      name
    }
    ... on StixCyberObservable {
      observable_value
    }
    ... on StixFile {
      x_opencti_additional_names
    }
    ... on IPv4Addr {
      countries {
        edges {
          node {
            name
            x_opencti_aliases
          }
        }
      }
    }
    ... on IPv6Addr {
      countries {
        edges {
          node {
            name
            x_opencti_aliases
          }
        }
      }
    }
    createdBy {
      ... on Identity {
        name
      }
    }
    objectMarking {
      id
      definition_type
      definition
      x_opencti_order
      x_opencti_color
    }
    objectLabel {
      id
      value
      color
    }
    creators {
      id
      name
    }
    containersNumber {
      total
    }
  }
`;

const searchStixCoreObjectsLinesQuery = graphql`
  query SearchStixCoreObjectsLinesPaginationQuery(
    $types: [String]
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: StixCoreObjectsOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...SearchStixCoreObjectsLines_data
    @arguments(
      types: $types
      search: $search
      count: $count
      cursor: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    )
  }
`;

export const searchStixCoreObjectsLinesSearchQuery = graphql`
  query SearchStixCoreObjectsLinesSearchQuery(
    $types: [String]
    $filters: FilterGroup
    $search: String
  ) {
    stixCoreObjects(types: $types, search: $search, filters: $filters) {
      edges {
        node {
          id
          entity_type
          created_at
          updated_at
          ... on AttackPattern {
            name
            description
            aliases
          }
          ... on Campaign {
            name
            description
            aliases
          }
          ... on Note {
            attribute_abstract
            content
          }
          ... on ObservedData {
            name
            first_observed
            last_observed
          }
          ... on Opinion {
            opinion
            explanation
          }
          ... on Report {
            name
            description
          }
          ... on Grouping {
            name
            description
          }
          ... on CourseOfAction {
            name
            description
            x_opencti_aliases
          }
          ... on Individual {
            name
            description
            x_opencti_aliases
          }
          ... on Organization {
            name
            description
            x_opencti_aliases
          }
          ... on Sector {
            name
            description
            x_opencti_aliases
          }
          ... on System {
            name
            description
            x_opencti_aliases
          }
          ... on Indicator {
            name
            description
          }
          ... on Infrastructure {
            name
            description
          }
          ... on IntrusionSet {
            name
            aliases
            description
          }
          ... on Position {
            name
            description
            x_opencti_aliases
          }
          ... on City {
            name
            description
            x_opencti_aliases
          }
          ... on AdministrativeArea {
            name
            description
            x_opencti_aliases
          }
          ... on Country {
            name
            description
            x_opencti_aliases
          }
          ... on Region {
            name
            description
            x_opencti_aliases
          }
          ... on Malware {
            name
            aliases
            description
          }
          ... on ThreatActor {
            name
            aliases
            description
          }
          ... on Tool {
            name
            aliases
            description
          }
          ... on Vulnerability {
            name
            description
          }
          ... on Incident {
            name
            aliases
            description
          }
          ... on Event {
            name
            aliases
            description
          }
          ... on Channel {
            name
            aliases
            description
          }
          ... on Narrative {
            name
            aliases
            description
          }
          ... on Language {
            name
            aliases
          }
          ... on DataComponent {
            name
          }
          ... on DataSource {
            name
          }
          ... on Case {
            name
          }
          ... on StixCyberObservable {
            observable_value
          }
          ... on StixFile {
            x_opencti_additional_names
          }
          ... on IPv4Addr {
            countries {
              edges {
                node {
                  name
                  x_opencti_aliases
                }
              }
            }
          }
          ... on IPv6Addr {
            countries {
              edges {
                node {
                  name
                  x_opencti_aliases
                }
              }
            }
          }
          createdBy {
            ... on Identity {
              name
            }
          }
          objectMarking {
            id
            definition_type
            definition
            x_opencti_order
            x_opencti_color
          }
          objectLabel {
            id
            value
            color
          }
          creators {
            id
            name
          }
          containersNumber {
            total
          }
        }
      }
    }
  }
`;

export const searchStixCoreObjectsLinesFragment = graphql`
  fragment SearchStixCoreObjectsLines_data on Query
  @argumentDefinitions(
    types: { type: "[String]" }
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "StixCoreObjectsOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "SearchStixCoreObjectsLinesRefetchQuery") {
    globalSearch(
      types: $types
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_globalSearch") {
      edges {
        node {
          id
          entity_type
          created_at
          createdBy {
            ... on Identity {
              name
            }
          }
          creators {
            id
            name
          }
          objectMarking {
            id
            definition_type
            definition
            x_opencti_order
            x_opencti_color
          }
          ...SearchStixCoreObjectLine_node
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        globalCount
      }
    }
  }
`;

const Search = () => {
  const {
    platformModuleHelpers: { isRuntimeFieldEnable },
  } = useAuth();
  const isEnterpriseEdition = useEnterpriseEdition();
  const navigate = useNavigate();
  const { t_i18n } = useFormatter();
  const { keyword } = useParams() as { keyword: string };

  const searchTerm = decodeSearchKeyword(keyword);

  const initialValues = {
    sortBy: '_score',
    orderAsc: false,
    openExports: false,
    filters: {
      ...emptyFilterGroup,
      filters: useGetDefaultFilterObject(['entity_type'], ['Stix-Core-Object']),
    },
  };
  const { viewStorage, helpers: storageHelpers, paginationOptions } = usePaginationLocalStorage<SearchStixCoreObjectsLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );
  const {
    filters,
  } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('Stix-Core-Object', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as SearchStixCoreObjectsLinesPaginationQuery$variables;
  const queryRef = useQueryLoading<SearchStixCoreObjectsLinesPaginationQuery>(
    searchStixCoreObjectsLinesQuery,
    { ...queryPaginationOptions, search: searchTerm },
  );

  const isRuntimeSort = isRuntimeFieldEnable() ?? false;
  const dataColumns = {
    entity_type: {
      label: 'Type',
      flexSize: 10,
      isSortable: true,
    },
    value: {
      label: 'Value',
      flexSize: 22,
      isSortable: false,
    },
    createdBy: {
      label: 'Author',
      flexSize: 12,
      isSortable: isRuntimeSort,
    },
    creator: {
      label: 'Creator',
      flexSize: 12,
      isSortable: isRuntimeSort,
    },
    objectLabel: {
      label: 'Labels',
      flexSize: 16,
      isSortable: false,
    },
    created_at: {
      label: 'Platform creation date',
      flexSize: 10,
      isSortable: true,
    },
    analyses: {
      label: 'Analyses',
      flexSize: 8,
      isSortable: false,
    },
    objectMarking: {
      label: 'Marking',
      flexSize: 10,
      isSortable: isRuntimeSort,
    },
  };

  const preloadedPaginationOptions = {
    linesQuery: searchStixCoreObjectsLinesQuery,
    linesFragment: searchStixCoreObjectsLinesFragment,
    queryRef,
    nodePath: ['globalSearch', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<SearchStixCoreObjectsLinesPaginationQuery>;

  return (
    <ExportContextProvider>
      <>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: SearchStixCoreObjectsLines_data$data) => data.globalSearch?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            toolbarFilters={contextFilters}
            lineFragment={searchLineFragment}
            preloadedPaginationProps={preloadedPaginationOptions}
          />
        )}
      </>
    </ExportContextProvider>
  );
};

export default Search;
