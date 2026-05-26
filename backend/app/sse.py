import asyncio
import math
from collections.abc import AsyncIterator, Sequence

DEFAULT_STREAM_DURATION = 4.2
MIN_STREAM_INTERVAL = 0.04
MAX_STREAM_INTERVAL = 1.5


def _chunk_lines(lines: Sequence[str], duration: float) -> list[str]:
    if not lines:
        return []

    max_events = max(1, int(duration / MIN_STREAM_INTERVAL) - 1)
    chunk_size = max(1, math.ceil(len(lines) / max_events))

    return ["\n".join(lines[index : index + chunk_size]) for index in range(0, len(lines), chunk_size)]


def _sse_data(data: str) -> str:
    return "".join(f"data: {line}\n" for line in data.split("\n")) + "\n"


async def sse_stream(
    lines: Sequence[str], delay: float | None = None, duration: float = DEFAULT_STREAM_DURATION
) -> AsyncIterator[str]:
    target_duration = max(float(duration), MIN_STREAM_INTERVAL * 2)
    chunks = list(lines) if delay is not None else _chunk_lines(lines, target_duration)
    interval = delay if delay is not None else target_duration / max(len(chunks) + 1, 1)
    interval = min(max(interval, MIN_STREAM_INTERVAL), MAX_STREAM_INTERVAL)

    for chunk in chunks:
        await asyncio.sleep(interval)
        yield _sse_data(chunk)

    await asyncio.sleep(interval)
    yield "data: [done]\n\n"
