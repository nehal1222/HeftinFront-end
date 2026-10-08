import type {
  AuthMeResponse,
  AuthTokenResponse,
  AuthUser,
  LoginRequest,
  RefreshResponse,
} from '@/types/auth'

type DevelopmentAccount = {
  login: string
  password: string
  user: AuthUser
}

const ACCESS_TOKEN_PREFIX = 'heftin-dev-access:'
const REFRESH_TOKEN_PREFIX = 'heftin-dev-refresh:'

function isEnabled() {
  return import.meta.env.DEV && import.meta.env.VITE_ENABLE_TEST_AUTH === 'true'
}

function getAccounts(): DevelopmentAccount[] {
  if (!isEnabled()) return []

  const organization = {
    id: 'heftin-academy-test-org',
    name: 'Heftin Academy Test Organization',
  }
  const accounts: Array<DevelopmentAccount | null> = [
    import.meta.env.VITE_TEST_ADMIN_LOGIN && import.meta.env.VITE_TEST_ADMIN_PASSWORD
      ? {
          login: import.meta.env.VITE_TEST_ADMIN_LOGIN,
          password: import.meta.env.VITE_TEST_ADMIN_PASSWORD,
          user: {
            id: 'dev-org-admin',
            email: import.meta.env.VITE_TEST_ADMIN_LOGIN,
            mobile: null,
            full_name: 'Admin Demo',
            status: 'active',
            must_change_password: false,
            roles: ['organization_admin'],
            rights: [
              'exams.view',
              'study_material.view',
              'performance.view',
              'users.view',
              'roles.view',
              'batches.view',
              'evaluations.review',
            ],
            current_organization: organization,
          },
        }
      : null,
    import.meta.env.VITE_TEST_STUDENT_LOGIN && import.meta.env.VITE_TEST_STUDENT_PASSWORD
      ? {
          login: import.meta.env.VITE_TEST_STUDENT_LOGIN,
          password: import.meta.env.VITE_TEST_STUDENT_PASSWORD,
          user: {
            id: 'dev-student',
            email: import.meta.env.VITE_TEST_STUDENT_LOGIN,
            mobile: null,
            full_name: 'Student Demo',
            status: 'active',
            must_change_password: false,
            roles: ['student'],
            rights: [
              'exams.view',
              'study_material.view',
              'performance.view',
            ],
            current_organization: organization,
          },
        }
      : null,
  ]

  return accounts.filter((account): account is DevelopmentAccount => account !== null)
}

function findAccountByToken(token: string | null | undefined, prefix: string) {
  if (!token?.startsWith(prefix)) return undefined
  const userId = token.slice(prefix.length)
  return getAccounts().find((account) => account.user.id === userId)
}

function createTokenResponse(account: DevelopmentAccount): AuthTokenResponse {
  const bootstrapUser = {
    ...account.user,
    roles: [],
    rights: [],
  }

  return {
    access_token: `${ACCESS_TOKEN_PREFIX}${account.user.id}`,
    refresh_token: `${REFRESH_TOKEN_PREFIX}${account.user.id}`,
    token_type: 'bearer',
    user: bootstrapUser,
    current_organization: account.user.current_organization ?? null,
    roles: [],
    rights: [],
  }
}

export const developmentAuthService = {
  login(payload: LoginRequest): AuthTokenResponse | null {
    const normalizedLogin = payload.login.trim().toLocaleLowerCase()
    const account = getAccounts().find(
      (candidate) =>
        candidate.login.toLocaleLowerCase() === normalizedLogin &&
        candidate.password === payload.password,
    )

    return account ? createTokenResponse(account) : null
  },

  getMe(accessToken: string | null | undefined): AuthMeResponse | null {
    return findAccountByToken(accessToken, ACCESS_TOKEN_PREFIX)?.user ?? null
  },

  refresh(refreshToken: string): RefreshResponse | null {
    const account = findAccountByToken(refreshToken, REFRESH_TOKEN_PREFIX)
    if (!account) return null

    return {
      access_token: `${ACCESS_TOKEN_PREFIX}${account.user.id}`,
      refresh_token: `${REFRESH_TOKEN_PREFIX}${account.user.id}`,
      token_type: 'bearer',
    }
  },

  isAccessToken(accessToken: string | null | undefined) {
    return Boolean(findAccountByToken(accessToken, ACCESS_TOKEN_PREFIX))
  },
}
