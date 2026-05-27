from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from .mock_data import midterm_code_comparison, midterm_project_log, midterm_project_result
from .sse import DEFAULT_STREAM_DURATION, sse_stream

app = FastAPI(title="Middle Check Local Mock Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/midterm/{project}/execute/{algo}/{dataset}/")
async def midterm_project_execute(
    project: str,
    algo: str,
    dataset: str,
    scale: str | None = None,
    duration: float = DEFAULT_STREAM_DURATION,
) -> StreamingResponse:
    return StreamingResponse(
        sse_stream(midterm_project_log(project, algo, dataset, scale), duration=duration),
        media_type="text/event-stream",
    )


@app.get("/midterm/{project}/result/{algo}/{dataset}/")
async def midterm_project_get_result(project: str, algo: str, dataset: str, scale: str | None = None) -> dict[str, object]:
    return {"data": midterm_project_result(project, algo, dataset, scale)}


@app.get("/midterm/{project}/code/{algo}/")
async def midterm_project_get_code(project: str, algo: str) -> dict[str, object]:
    return {"data": midterm_code_comparison(project, algo)}
