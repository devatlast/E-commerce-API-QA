 const {defineConfig} = require ('@playwright/test');

module.exports = defineConfig({
    testDir: './tests/playwright',
    use: {
        baseURL: 'https://e-commerce-api-qa.vercel.app',
    },
});