import React, { ReactNode } from 'react';
import { MockEnvironment, MockPayloadGenerator } from 'relay-test-utils';
import { BrowserRouter } from 'react-router-dom';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay';
import { UserContext, UserContextType } from '../hooks/useAuth';
import { APP_BASE_PATH } from '../../relay/environment';
import AppIntlProvider from '../../components/AppIntlProvider';
import createMockUserContext from './createMockUserContext';
import useQueryLoading from '../hooks/useQueryLoading';
import { TestWrapperProvidersEntitySettingsQuery } from './__generated__/TestWrapperProvidersEntitySettingsQuery.graphql';

const entitySettingsQuery = graphql`
  query TestWrapperProvidersEntitySettingsQuery {
    entitySettings {
      edges {
        node {
          id
          ...EntitySettingSettings_entitySetting
        }
      }
    }
  }
`;

interface TestWrapperUserProviderQueryProps {
  children: ReactNode
  queryRef: PreloadedQuery<TestWrapperProvidersEntitySettingsQuery>
  userContext: Partial<UserContextType>
}

const TestWrapperUserProviderQuery = ({
  queryRef,
  children,
  userContext,
}: TestWrapperUserProviderQueryProps) => {
  const { entitySettings } = usePreloadedQuery(entitySettingsQuery, queryRef);
  const userContextWithEntitySettings = {
    ...userContext,
    entitySettings,
  } as UserContextType;

  return (
    <UserContext.Provider value={userContextWithEntitySettings}>
      {children}
    </UserContext.Provider>
  );
};

interface TestWrapperUserProviderProps {
  children: ReactNode
  userContext: Partial<UserContextType>
}

const TestWrapperUserProvider = ({ children, userContext }: TestWrapperUserProviderProps) => {
  const queryRef = useQueryLoading<TestWrapperProvidersEntitySettingsQuery>(entitySettingsQuery);
  if (!queryRef) return null;

  return (
    <TestWrapperUserProviderQuery queryRef={queryRef} userContext={userContext}>
      {children}
    </TestWrapperUserProviderQuery>
  );
};

interface TestWrapperProvidersProps {
  children: ReactNode
  relayEnv: MockEnvironment
  userContext?: Partial<UserContextType>
}

const TestWrapperProviders = ({ children, relayEnv, userContext }: TestWrapperProvidersProps) => {
  const defaultUserContext = userContext ?? createMockUserContext();

  relayEnv.mock.queuePendingOperation(entitySettingsQuery, {});
  relayEnv.mock.queueOperationResolver((o) => {
    const generatedData = MockPayloadGenerator.generate(o);
    const queryName = o.fragment.node.name;
    if (queryName === 'TestWrapperProvidersEntitySettingsQuery') {
      return {
        data: {
          entitySettings: {
            edges: (defaultUserContext?.entitySettings?.edges ?? []).map((edge) => ({
              node: {
                ...generatedData.data?.entitySettings?.edges[0]?.node,
                ...edge.node,
              },
            })),
          },
        },
      };
    }
    return generatedData;
  });

  return (
    <BrowserRouter basename={APP_BASE_PATH}>
      <RelayEnvironmentProvider environment={relayEnv}>
        <AppIntlProvider settings={{ platform_language: 'auto' }}>
          <ThemeProvider theme={createTheme()}>
            <TestWrapperUserProvider userContext={defaultUserContext}>
              {children}
            </TestWrapperUserProvider>
          </ThemeProvider>
        </AppIntlProvider>
      </RelayEnvironmentProvider>
    </BrowserRouter>
  );
};

export default TestWrapperProviders;
