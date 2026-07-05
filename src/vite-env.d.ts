/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_SKIP_BOOT_SPLASH?: string;
  readonly VITE_E2E_EXERCISE_COUNT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
