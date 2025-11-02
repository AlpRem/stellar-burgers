import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    viewportWidth: 2000,
    viewportHeight: 1192,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
