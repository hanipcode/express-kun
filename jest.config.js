/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["dist"],
  collectCoverage: true,
  coveragePathIgnorePatterns: ["/node_modules/", "/__test__/"],
  coverageReporters: ["html"],
  coverageDirectory: "./docs/coverage",
};
