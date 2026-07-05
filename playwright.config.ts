import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.VITE_PORT ?? 5199);
const apiPort = process.env.API_PORT ?? '3101';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${String(port)}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 120_000,
  use: {
    baseURL,
    trace: 'on-first-retry',
    viewport: { width: 768, height: 1024 },
  },
  projects: [
    {
      name: 'ipad-air-2',
      use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } },
    },
  ],
  webServer: {
    command: 'npm run dev:all',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ...process.env,
      MOCK_LLM: 'true',
      VITE_SKIP_BOOT_SPLASH: 'true',
      VITE_E2E_EXERCISE_COUNT: '3',
      VITE_PORT: String(port),
      API_PORT: apiPort,
    },
  },
});
