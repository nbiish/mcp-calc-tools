#!/bin/bash

# Create virtual environment if it doesn't exist
[ ! -d "venv" ] && python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Make server file executable
chmod +x src/server.py

# Create bin directory
mkdir -p bin

# Create launcher script
cat > bin/mcp-calc-tools << 'EOF'
#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$DIR/../venv/bin/activate"
exec python3 "$DIR/../src/server.py" "$@"
EOF

chmod +x bin/mcp-calc-tools
