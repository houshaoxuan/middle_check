from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, StreamingResponse

from .mock_data import (
    PART3_DYNAMIC_RESULTS,
    PART3_RESULT_DATA,
    PART3_STAGE_SNIPPETS,
    execution_log,
    part1_result,
    part2_log,
    part6_log,
    part6_result,
)
from .sse import sse_stream

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


@app.get("/part1/execute/{algo}/{dataset}/")
async def part1_execute(algo: str, dataset: str) -> StreamingResponse:
    lines = execution_log("课题一加速器性能测试", algo, dataset)
    return StreamingResponse(sse_stream(lines), media_type="text/event-stream")


@app.get("/part1/result/{algo}/{dataset}/")
async def part1_get_result(algo: str, dataset: str) -> dict[str, object]:
    return {"data": part1_result(algo, dataset)}


@app.get("/logfile/{name}", response_class=PlainTextResponse)
async def logfile(name: str) -> str:
    return part2_log(name)


@app.get("/part3/execute/1/{algo}/{dataset}/")
async def part3_model_execute(algo: str, dataset: str) -> StreamingResponse:
    lines = execution_log("CGA编程模型编译", algo, dataset)
    return StreamingResponse(sse_stream(lines), media_type="text/event-stream")


@app.get("/part3/result/1/{algo}/")
async def part3_model_result(algo: str) -> dict[str, object]:
    return {"data": PART3_RESULT_DATA}


@app.get("/part3data/1/{algo}/{stage}/")
async def part3_stage_data(algo: str, stage: str) -> dict[str, list[str]]:
    return {"data": PART3_STAGE_SNIPPETS.get(stage, PART3_STAGE_SNIPPETS["GraphIR"])}


@app.get("/part3/cgafile/1/{algo}/{_mode}/")
async def part3_cga_file(algo: str, _mode: str) -> dict[str, list[str]]:
    return {"content": PART3_RESULT_DATA["CGA"]}


@app.get("/part3/moni/1/{algo}/{dataset}/")
async def part3_model_simulator(algo: str, dataset: str) -> StreamingResponse:
    lines = execution_log("模拟器运行", algo, dataset)
    return StreamingResponse(sse_stream(lines), media_type="text/event-stream")


@app.get("/part3/execute/2/{algo}/{dataset}/")
async def part3_convert_execute(algo: str, dataset: str) -> StreamingResponse:
    lines = execution_log("框架转换与编译", algo, dataset)
    return StreamingResponse(sse_stream(lines), media_type="text/event-stream")


@app.get("/part3/result/2/{algo}/")
async def part3_convert_result(algo: str) -> dict[str, object]:
    return {"data": PART3_RESULT_DATA}


@app.get("/part3/moni2/{algo}/{dataset}/")
async def part3_convert_simulator(algo: str, dataset: str) -> StreamingResponse:
    lines = execution_log("转换后模拟器运行", algo, dataset)
    return StreamingResponse(sse_stream(lines), media_type="text/event-stream")


@app.get("/part3/execute/3/{dataset}/")
async def part3_dynamic_execute(dataset: str) -> StreamingResponse:
    lines = execution_log("动态图数据管理评测", dataset=dataset)
    return StreamingResponse(sse_stream(lines), media_type="text/event-stream")


@app.get("/part3/result/3/{dataset}/")
async def part3_dynamic_result(dataset: str) -> dict[str, object]:
    return PART3_DYNAMIC_RESULTS.get(dataset, PART3_DYNAMIC_RESULTS["askubuntu"])


@app.get("/part6/execute/{algo}/{dataset}/")
async def part6_execute(algo: str, dataset: str) -> StreamingResponse:
    return StreamingResponse(sse_stream(part6_log(algo, dataset)), media_type="text/event-stream")


@app.get("/part6/result/{algo}/{dataset}/")
async def part6_get_result(algo: str, dataset: str) -> dict[str, object]:
    return {"data": part6_result(algo, dataset)}
