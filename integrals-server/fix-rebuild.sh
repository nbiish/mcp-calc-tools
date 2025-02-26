#!/bin/bash

echo "Fixing module format issues..."
echo "1. Cleaning build directory..."
rm -rf build/

echo "2. Reinstalling dependencies..."
npm install

echo "3. Building project with CommonJS format..."
npm run build

echo "4. Setting executable permissions..."
chmod +x build/index.js

echo "5. Testing server..."
node -e "try { require('./build/index.js'); console.log('✅ Server imports successfully'); } catch(e) { console.error('❌ Server import failed:', e.message); }"

echo "Build process complete. If no errors were shown above, the server should be ready."
