import { describe, it, expect } from 'vitest';
import { createMockEnvironment } from 'relay-test-utils';
import React from 'react';
import { EntitySettingSettings_entitySetting$data } from '@components/settings/sub_types/entity_setting/__generated__/EntitySettingSettings_entitySetting.graphql';
import useEntitySettings from './useEntitySettings';
import testRender from '../tests/testRender';
import MOCK_ENTITY_SETTINGS from '../tests/mockEntitySettings';
import createMockUserContext from '../tests/createMockUserContext';

describe('Hook: useEntitySettings', () => {
  it('should return all entity settings', () => {
    const relayEnv = createMockEnvironment();
    let settings: EntitySettingSettings_entitySetting$data[] = [];

    const Wrapper = () => {
      settings = useEntitySettings();
      return <p>useEntitySettings</p>;
    };

    testRender(<Wrapper />, {
      relayEnv,
      userContext: createMockUserContext({
        entitySettings: {
          edges: [
            { node: MOCK_ENTITY_SETTINGS.report },
            { node: MOCK_ENTITY_SETTINGS.malware },
            { node: MOCK_ENTITY_SETTINGS.position },
          ],
        },
      }),
    });

    expect(settings.length).toBe(3);
  });

  it('should return the corresponding entity setting', () => {
    const relayEnv = createMockEnvironment();
    let settings: EntitySettingSettings_entitySetting$data[] = [];

    const Wrapper = () => {
      settings = useEntitySettings('Report');
      return <p>useEntitySettings</p>;
    };

    testRender(<Wrapper />, {
      relayEnv,
      userContext: createMockUserContext({
        entitySettings: {
          edges: [
            { node: MOCK_ENTITY_SETTINGS.report },
            { node: MOCK_ENTITY_SETTINGS.malware },
            { node: MOCK_ENTITY_SETTINGS.position },
          ],
        },
      }),
    });

    expect(settings.length).toBe(1);
    expect(settings[0].target_type).toBe('Report');
  });
});
