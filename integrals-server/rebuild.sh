#!/bin/bash
# Proper script to clean, build, and set permissions

echo "Cleaning build directory..."
rm -rf build/

echo "Building project..."
npm run build

echo "Setting executable permissions..."
chmod +x build/index.js

echo "Build process complete. If no errors were shown above, the server should be ready."
