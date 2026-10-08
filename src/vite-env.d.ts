/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_SIGNUP_URL?: string
  readonly VITE_ENABLE_TEST_AUTH?: string
  readonly VITE_TEST_ADMIN_LOGIN?: string
  readonly VITE_TEST_ADMIN_PASSWORD?: string
  readonly VITE_TEST_STUDENT_LOGIN?: string
  readonly VITE_TEST_STUDENT_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
