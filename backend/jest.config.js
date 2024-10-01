// jest.config.js

module.exports = {
    collectCoverage: true,  // Enable coverage collection
    collectCoverageFrom: [
      "routes/**/*.js",  // Include all route files for testing (auth, cart, product)
      "models/**/*.js",  // Optionally include model logic (if needed)
    ],
    coverageDirectory: "coverage",  // Directory to output the coverage reports
    coverageReporters: ["text", "lcov"],  // Formats: text for terminal, lcov for HTML reports
    testEnvironment: "node",  // Test environment for Node.js apps
  };
  