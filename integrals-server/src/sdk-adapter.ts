/**
 * This adapter works around the exports issue with the @modelcontextprotocol/sdk package
 * by directly requiring its files using relative paths.
 */

// Using dynamic require to access the package's internal files
const sdkPath = require.resolve('@modelcontextprotocol/sdk/package.json');
const sdkDir = sdkPath.replace('/package.json', '');

// Import the necessary functions from the SDK's dist directory
const { createServer: _createServer } = require(`${sdkDir}/dist/server`);
const { defineTools: _defineTools } = require(`${sdkDir}/dist/tools`);

// Export with the same interface
export const createServer = _createServer;
export const defineTools = _defineTools;
