import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    
    use: {
        baseURL: 'http://localhost:3001',
        trace: 'on-first-retry',
        headless: false,  // Always show browser window
    },
    
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    
    // Auto-start the server for tests
    webServer: {
        command: 'npx serve sample-app -p 3001',
        port: 3001,
        reuseExistingServer: !process.env.CI,
    },
});
