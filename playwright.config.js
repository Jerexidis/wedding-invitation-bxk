import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './tests',
    timeout: 30_000,
    fullyParallel: false,
    forbidOnly: true,
    retries: 0,
    workers: 1,
    reporter: 'line',
    use: {
        baseURL: 'http://127.0.0.1:4173',
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        reducedMotion: 'reduce',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    webServer: {
        command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: false,
        timeout: 30_000,
    },
})
