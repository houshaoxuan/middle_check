import asyncio
from collections.abc import AsyncIterator, Sequence


async def sse_stream(lines: Sequence[str], delay: float | None = None, duration: float = 6.5) -> AsyncIterator[str]:
    interval = delay if delay is not None else min(max(duration / (len(lines) + 1), 0.035), 0.45)

    for line in lines:
        await asyncio.sleep(interval)
        yield f"data: {line}\n\n"

    await asyncio.sleep(interval)
    yield "data: [done]\n\n"
