export const APP_NAME = 'Heftin Academy'

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'hac_access_token',
  REFRESH_TOKEN: 'hac_refresh_token',
  USER: 'hac_user',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PEOPLE: '/people',
  ROLES: '/roles',
  DEPARTMENTS: '/departments',
  BATCHES: '/batches',
  AUDIT: '/audit',
  PLATFORM_ORGANIZATIONS: '/platform/organizations',
  PLATFORM_RIGHTS: '/platform/rights',
  DESIGN_SYSTEM: '/design-system',
  NOT_FOUND: '*',
} as const
