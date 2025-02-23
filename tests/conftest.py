import pytest
from typing import Generator

@pytest.fixture
def event_loop() -> Generator:
    """Create an instance of the default event loop for each test case."""
    import asyncio
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()
