#!/bin/bash

echo "=== Deep Fix for MCP SDK Issues ==="

echo "1. Cleaning build and node_modules..."
rm -rf build/
rm -rf node_modules/
rm -f package-lock.json

echo "2. Installing MCP SDK with explicit version..."
npm install @modelcontextprotocol/sdk@0.5.0

echo "3. Examining installed package..."
PACKAGE_DIR="node_modules/@modelcontextprotocol/sdk"
if [ -d "$PACKAGE_DIR" ]; then
  echo "✓ SDK package installed at $PACKAGE_DIR"
  
  echo "   Checking package structure:"
  ls -la "$PACKAGE_DIR" | grep -v node_modules
  
  echo "   Checking dist directory:"
  if [ -d "$PACKAGE_DIR/dist" ]; then
    ls -la "$PACKAGE_DIR/dist"
  else
    echo "❌ No dist directory found"
  fi
  
  echo "   Checking package.json:"
  cat "$PACKAGE_DIR/package.json" | grep -E '("main"|"exports"|"type")'
else
  echo "❌ SDK package not installed correctly"
fi

echo "4. Building project..."
npm run build

echo "5. Setting executable permissions..."
chmod +x build/index.js

echo "6. Creating simple test client..."
cat > test-client.js << 'EOL'
#!/usr/bin/env node
const net = require('net');
const { spawn } = require('child_process');

// Start the server process
const server = spawn('node', ['./build/index.js'], {
  stdio: ['pipe', 'pipe', process.stderr]
});

// Give it a moment to start
setTimeout(() => {
  console.log("Sending test request to server...");
  
  // Simulate an MCP request
  const request = {
    jsonrpc: "2.0",
    id: "test123",
    method: "calculateIntegral",
    params: {
      expression: "x^2",
      lowerBound: 0,
      upperBound: 1
    }
  };
  
  server.stdin.write(JSON.stringify(request) + "\n");
  
  // Listen for response
  server.stdout.on('data', (data) => {
    console.log("Server response:", data.toString());
    server.kill();
    process.exit(0);
  });
  
  // Set timeout
  setTimeout(() => {
    console.error("No response received within timeout period");
    server.kill();
    process.exit(1);
  }, 5000);
}, 1000);
EOL

chmod +x test-client.js

echo "7. Testing server with direct client..."
node ./test-client.js

echo "=== Fix process complete ==="
echo "If the test client received a response, try restarting VS Code completely"
