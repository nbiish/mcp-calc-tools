#!/bin/bash

# Create virtual environment using uv
uv venv

# Generate lock file if it doesn't exist
[ ! -f "requirements.lock" ] && uv pip compile requirements.txt -o requirements.lock

# Install dependencies from lock file
uv pip install -r requirements.lock

# Make server file executable
chmod +x src/server.py

# Create bin directory
mkdir -p bin

# Create launcher script
cat > bin/mcp-calc-tools << 'EOF'
#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
export VIRTUAL_ENV="$DIR/../.venv"
export PATH="$VIRTUAL_ENV/bin:$PATH"
exec python3 "$DIR/../src/server.py" "$@"
EOF

chmod +x bin/mcp-calc-tools
