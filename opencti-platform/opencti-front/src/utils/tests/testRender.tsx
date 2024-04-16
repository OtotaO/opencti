import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { createMockEnvironment, MockEnvironment } from 'relay-test-utils';
import userEvent from '@testing-library/user-event';
import { UserContextType } from '../hooks/useAuth';
import TestWrapperProviders from './TestWrapperProviders';

interface TestRenderOptions {
  relayEnv?: MockEnvironment,
  userContext?: Partial<UserContextType>,
}

/**
 * Renders a React component to test it.
 *
 * @param ui The React component to test.
 * @param options (optional) Options to configure mocked providers needed to render the component.
 * @returns Rendered component we can manipulate and make assertions on.
 */
const testRender = (ui: ReactNode, options?: TestRenderOptions) => {
  const { userContext } = options ?? {};
  const relayEnv = options?.relayEnv ?? createMockEnvironment();

  const rendered = render(ui, {
    wrapper: ({ children }) => (
      <TestWrapperProviders relayEnv={relayEnv} userContext={userContext}>
        {children}
      </TestWrapperProviders>
    ),
  });

  return {
    user: userEvent.setup(),
    rendered,
  };
};

export default testRender;
