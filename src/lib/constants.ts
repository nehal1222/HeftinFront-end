export const APP_NAME = 'Heftin Academy'
export const SIGNUP_URL = import.meta.env.VITE_SIGNUP_URL

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'hac_access_token',
  REFRESH_TOKEN: 'hac_refresh_token',
  USER: 'hac_user',
} as const
export const SESSION_KEYS = {
  SESSION_EXPIRED: 'hac_session_expired',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  ROLES: '/roles',
  PLATFORM: '/platform',
  DESIGN_SYSTEM: '/design-system',
  NOT_FOUND: '*',
} as const
