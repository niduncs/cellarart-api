module.exports = {
  setupTestFrameworkScriptFile: '<rootDir>/__tests__/setup.js',
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/mocks/',
    '<rootDir>/__tests__/setup.js'
  ],
  testEnvironment: 'node',
  bail: true,
  verbose: true
};
