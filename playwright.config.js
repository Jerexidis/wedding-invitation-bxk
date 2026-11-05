import { defineConfig } from '@playwright/test'

const previewPort = process.env.PLAYWRIGHT_PREVIEW_PORT || '4174'

export default defineConfig({
    testDir: './tests',
    timeout: 30_000,
    fullyParallel: false,
    forbidOnly: true,
    retries: 0,
    workers: 1,
    reporter: 'line',
    use: {
        baseURL: `http://127.0.0.1:${previewPort}`,
        browserName: 'chromium',
        channel: 'chrome',
        viewport: { width: 390, height: 844 },
        reducedMotion: 'reduce',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    webServer: {
        command: `npm run preview -- --host 127.0.0.1 --port ${previewPort} --strictPort`,
        url: `http://127.0.0.1:${previewPort}`,
        // Mantener la prueba fuera del puerto de preview local (4173) evita choques
        // con servidores que ya estén abiertos durante la revisión.
        reuseExistingServer: true,
        timeout: 30_000,
    },
})
