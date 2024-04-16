import { UserContextType } from '../hooks/useAuth';

const DEFAULT_ADMIN = {
  name: 'admin',
  user_email: 'admin@opencti.io',
  firstname: 'Admin',
  lastname: 'OpenCTI',
  language: 'en-us',
  unit_system: 'auto',
  theme: 'default',
  external: true,
  userSubscriptions: {
    edges: [],
  },
};

// 'unknown' to facilitate mocking partial context without having TS errors
interface CreateUserContextOptions {
  me?: unknown,
  settings?: unknown,
  bannerSettings?: unknown,
  entitySettings?: unknown,
  platformModuleHelpers?: unknown,
  schema?: unknown,
}

/**
 * Create a fake user context to match your needs while testing.
 * If no special need, you don't have to specify any option.
 *
 * @param options (optional) Context values to push into the fake context.
 * @returns The user context for the tests.
 */
const createMockUserContext = (options?: CreateUserContextOptions): UserContextType => {
  const {
    me,
    settings,
    bannerSettings,
    entitySettings,
    platformModuleHelpers,
    schema,
  } = options ?? {};

  return {
    me: (me ?? DEFAULT_ADMIN) as UserContextType['me'],
    settings: (settings ?? {}) as UserContextType['settings'],
    bannerSettings: (bannerSettings ?? {}) as UserContextType['bannerSettings'],
    entitySettings: (entitySettings ?? {}) as UserContextType['entitySettings'],
    platformModuleHelpers: (platformModuleHelpers ?? {}) as UserContextType['platformModuleHelpers'],
    schema: (schema ?? {}) as UserContextType['schema'],
  };
};

export default createMockUserContext;
