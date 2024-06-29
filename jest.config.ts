import type { Config } from "jest";

const config: Config = {
  testTimeout: 50000,
  moduleNameMapper: {},
  transformIgnorePatterns: ["node_modules/!(firebase-admin)"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testPathIgnorePatterns: ["integration.test"],
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["<rootDir>/src/testHelpers/matchers.ts"],
};

export default config;
