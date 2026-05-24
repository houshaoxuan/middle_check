import asyncio
from collections.abc import AsyncIterator, Iterable


async def sse_stream(lines: Iterable[str], delay: float = 0.08) -> AsyncIterator[str]:
    for line in lines:
        await asyncio.sleep(delay)
        yield f"data: {line}\n\n"

    await asyncio.sleep(delay)
    yield "data: [done]\n\n"

