#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('---- MCP SERVER DIAGNOSTIC ----');

// Check build directory
const buildDir = path.join(__dirname, 'build');
console.log(`Checking build directory: ${buildDir}`);
if (!fs.existsSync(buildDir)) {
  console.log('❌ Build directory does not exist. Run "npm run build" first.');
} else {
  console.log('✓ Build directory exists');
  
  // Check index.js
  const indexFile = path.join(buildDir, 'index.js');
  if (!fs.existsSync(indexFile)) {
    console.log('❌ Built index.js file does not exist');
  } else {
    console.log('✓ index.js exists');
    
    // Check file content
    const content = fs.readFileSync(indexFile, 'utf8');
    if (content.includes('exports is not defined')) {
      console.log('❌ Module format issue detected in built file');
    } else if (content.includes('import') && content.includes('export')) {
      console.log('✓ File appears to use ES module syntax');
    }
    
    // Try running the server with node
    console.log('\nAttempting to run the server:');
    const result = spawnSync('node', [indexFile], { 
      encoding: 'utf8',
      timeout: 3000,
      stdio: 'pipe'
    });
    
    if (result.error) {
      console.log('❌ Error running server:', result.error.message);
    } else {
      console.log('Exit code:', result.status);
      if (result.stderr) console.log('stderr:', result.stderr);
      if (result.stdout) console.log('stdout:', result.stdout);
    }
  }
}

// Check file permissions
try {
  fs.chmodSync(path.join(buildDir, 'index.js'), '755');
  console.log('✓ Set executable permissions on index.js');
} catch (err) {
  console.log('❌ Could not set executable permissions:', err.message);
}

console.log('\n---- SUGGESTED ACTIONS ----');
console.log('1. Delete build/ directory and rebuild with: rm -rf build/ && npm run build');
console.log('2. Restart VS Code completely (not just the window)');
console.log('3. Check VS Code logs for MCP-related errors');
console.log('4. Run server manually with: node build/index.js');
console.log('5. Make sure package.json has "type": "module" and matching TypeScript config');
