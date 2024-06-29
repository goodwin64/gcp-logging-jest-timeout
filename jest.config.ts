import type { Config } from "jest";

const config: Config = {
  testTimeout: 50000,
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/$1",
    "@generated/(.*)": "<rootDir>/src/generated/$1",
  },
  transformIgnorePatterns: ["node_modules/!(firebase-admin)"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testPathIgnorePatterns: ["integration.test"],
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["<rootDir>/src/testHelpers/matchers.ts"],
};

export default config;
