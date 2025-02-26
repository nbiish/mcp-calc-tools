"""Command-line interface for MCP Calc Tools."""

import sys
import signal
import asyncio
import logging
from pathlib import Path

from .server import server

# Flag to track shutdown state
shutdown_requested = False

def signal_handler(signum, frame):
    """Handle shutdown signals gracefully."""
    global shutdown_requested
    if not shutdown_requested:
        logger.info("Shutdown requested...")
        shutdown_requested = True
        raise KeyboardInterrupt

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stderr)
    ]
)
logger = logging.getLogger(__name__)

def main():
    """CLI entry point for running the server."""
    try:
        # Set up signal handlers
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

        # Log startup
        logger.info("Starting MCP Calc Tools server...")
        
        try:
            # Run server with stdio
            server.run()
        except KeyboardInterrupt:
            logger.info("Shutting down...")
        except Exception as e:
            logger.error(f"Server error: {e}")
            return 1
            
        return 0
    except Exception as e:
        logger.error(f"Startup error: {e}")
        return 1

if __name__ == "__main__":
    main()
