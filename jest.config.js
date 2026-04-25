/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  testTimeout: 120000,
};
