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
