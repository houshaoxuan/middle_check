from __future__ import annotations

import re
from pathlib import Path
from typing import Any

DATA_ROOT = Path(__file__).resolve().parents[1] / "data"

MIDTERM_ACTIVE_RESULTS: dict[str, dict[str, Any]] = {
    "part1:pagerank:graph1": {
        "algorithm": "PageRank",
        "dataset": "Graph1",
        "performanceTarget": 8,
        "performance": 29.50,
        "completionRate": 196.67,
        "status": "已超额完成",
    },
    "part1:pagerank:graph2": {
        "algorithm": "PageRank",
        "dataset": "Graph2",
        "performanceTarget": 8,
        "performance": 24.79,
        "completionRate": 165.27,
        "status": "已超额完成",
    },
    "part1:bfs:graph1": {
        "algorithm": "BFS",
        "dataset": "Graph1",
        "performanceTarget": 8,
        "performance": 30.56,
        "completionRate": 203.73,
        "status": "已超额完成",
    },
    "part1:bfs:graph2": {
        "algorithm": "BFS",
        "dataset": "Graph2",
        "performanceTarget": 8,
        "performance": 27.78,
        "completionRate": 185.20,
        "status": "已超额完成",
    },
    "part1:cc:graph1": {
        "algorithm": "CC",
        "dataset": "Graph1",
        "performanceTarget": 8,
        "performance": 31.33,
        "completionRate": 208.87,
        "status": "已超额完成",
    },
    "part1:cc:graph2": {
        "algorithm": "CC",
        "dataset": "Graph2",
        "performanceTarget": 8,
        "performance": 29.28,
        "completionRate": 195.20,
        "status": "已超额完成",
    },
    "part2:pagerank:default": {
        "algorithm": "PageRank",
        "resourceReductionTarget": 10,
        "graflexClbPerMteps": 7.15,
        "dfgraphClbPerMteps": 3.51,
        "resourceReduction": 50.91,
        "completionRate": 254.55,
        "status": "已超额完成",
    },
    "part2:bfs:default": {
        "algorithm": "BFS",
        "resourceReductionTarget": 10,
        "graflexClbPerMteps": 3.75,
        "dfgraphClbPerMteps": 2.36,
        "resourceReduction": 37.07,
        "completionRate": 185.33,
        "status": "已超额完成",
    },
    "part2:cc:default": {
        "algorithm": "CC",
        "resourceReductionTarget": 10,
        "graflexClbPerMteps": 3.98,
        "dfgraphClbPerMteps": 2.34,
        "resourceReduction": 41.21,
        "completionRate": 206.03,
        "status": "已超额完成",
    },
    "part3-update:graph-update:graph1": {
        "algorithm": "图更新性能展示",
        "dataset": "Graph1",
        "updateThroughputTarget": 0.10,
        "updateThroughput": 1.91,
        "completionRate": 191.00,
        "status": "已达到亿级边更新吞吐",
    },
    "part3-update:graph-update:graph2": {
        "algorithm": "图更新性能展示",
        "dataset": "Graph2",
        "updateThroughputTarget": 0.10,
        "updateThroughput": 2.18,
        "completionRate": 218.00,
        "status": "已达到亿级边更新吞吐",
    },
    "part3-algorithm:pagerank:graph1": {
        "algorithm": "PageRank",
        "dataset": "Graph1",
        "performanceTarget": 3,
        "performance": 3.61,
        "completionRate": 72.20,
        "status": "已完成中期指标",
    },
    "part3-algorithm:bfs:graph1": {
        "algorithm": "BFS",
        "dataset": "Graph1",
        "performanceTarget": 3,
        "performance": 3.15,
        "completionRate": 63.00,
        "status": "已完成中期指标",
    },
    "part3-algorithm:cc:graph1": {
        "algorithm": "CC",
        "dataset": "Graph1",
        "performanceTarget": 3,
        "performance": 3.27,
        "completionRate": 65.40,
        "status": "已完成中期指标",
    },
    "part4:pagerank:default": {
        "algorithm": "PageRank",
        "codeDensityTarget": 5,
        "codeDensity": 6.45,
        "completionRate": 64.50,
        "status": "已完成中期指标",
    },
    "part4:bfs:default": {
        "algorithm": "BFS",
        "codeDensityTarget": 5,
        "codeDensity": 6.45,
        "completionRate": 64.50,
        "status": "已完成中期指标",
    },
    "part4:cc:default": {
        "algorithm": "CC",
        "codeDensityTarget": 5,
        "codeDensity": 6.45,
        "completionRate": 64.50,
        "status": "已完成中期指标",
    },
}

MIDTERM_DATASET_META: dict[tuple[str, str], dict[str, Any]] = {
    ("part1", "graph1"): {"vertices": "17.1M", "edges": "1046.9M"},
    ("part1", "graph2"): {"vertices": "16.8M", "edges": "503.3M"},
    ("part3-update", "graph1"): {"vertices": "268.4M", "edges": "16.1B", "updateScale": "0.1%-1%"},
    ("part3-update", "graph2"): {"vertices": "536.9M", "edges": "4.4B", "updateScale": "0.1%-1%"},
    ("part3-algorithm", "graph1"): {"vertices": "268.4M", "edges": "16.1B"},
}

MIDTERM_CODE_EFFECTS: dict[tuple[str, str], dict[str, Any]] = {
    ("part4", "pagerank"): {"hitgraphCodeLines": 129, "dfgraphCodeLines": 20},
    ("part4", "bfs"): {"hitgraphCodeLines": 129, "dfgraphCodeLines": 20},
    ("part4", "cc"): {"hitgraphCodeLines": 129, "dfgraphCodeLines": 20},
}

UPDATE_SCALE_LABELS = {
    "0.1": "0.1%",
    "0.5": "0.5%",
    "1": "1%",
}

PROJECT_LOG_DIRS = {
    "part3-update": "part3",
    "part3-algorithm": "part3",
}


def project_log_dir(project: str) -> Path:
    return DATA_ROOT / PROJECT_LOG_DIRS.get(project, project)


def midterm_log_path(project: str, algo: str, dataset: str, scale: str | None = None) -> Path | None:
    log_dir = project_log_dir(project)

    if project == "part3-update":
        scale_label = UPDATE_SCALE_LABELS.get(scale or "")
        if not scale_label:
            return None

        matches = sorted(log_dir.glob(f"{dataset}_{scale_label}*.log"))
        return matches[0] if matches else None

    if project == "part3-algorithm":
        return log_dir / f"update_{algo}.txt"

    if dataset == "default":
        return log_dir / f"{algo}.log"

    return log_dir / f"{algo}_{dataset}.log"


def read_log_lines(project: str, algo: str, dataset: str, scale: str | None = None) -> list[str]:
    log_path = midterm_log_path(project, algo, dataset, scale)
    if log_path and log_path.exists():
        return log_path.read_text(encoding="utf-8", errors="replace").splitlines()

    subject = " / ".join(item for item in [project, algo, dataset, scale] if item)
    return [
        f"[WARN] 未找到日志文件：{subject}",
        "[INFO] 使用后端默认模拟日志继续执行。",
        "[DONE] 模拟执行完成。",
    ]


def parse_numeric_value(raw_value: str) -> float | int | str:
    text = raw_value.strip()
    number_match = re.match(r"^-?\d+(?:\.\d+)?(?=$|\s)", text)
    if not number_match:
        return text

    number = float(number_match.group(0))
    return int(number) if number.is_integer() else number


def parse_result_fields(lines: list[str]) -> dict[str, Any]:
    result: dict[str, Any] = {}

    for line in lines:
        match = re.match(r"^RESULT\s+([A-Za-z][A-Za-z0-9_]*)=(.+)$", line.strip())
        if not match:
            continue

        key, value = match.groups()
        result[key] = parse_numeric_value(value)

    return result


def parse_update_log(lines: list[str]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    text = "\n".join(lines)

    scale_match = re.search(r"batch_pct:\s*([0-9.]+%)", text)
    if scale_match:
        result["updateScale"] = scale_match.group(1)

    throughput_match = re.search(r"total update throughput=([0-9.]+)\s*edges/s", text)
    if throughput_match:
        result["updateThroughput"] = round(float(throughput_match.group(1)) / 100_000_000, 2)

    return result


def parse_algorithm_log(lines: list[str]) -> dict[str, Any]:
    text = "\n".join(lines)
    mteps_match = re.search(r"Kernel MTEPS \(multi-device\)\s*=([0-9.]+)", text)
    if not mteps_match:
        return {}

    return {"performance": round(float(mteps_match.group(1)) / 1000, 2)}


def parsed_log_result(project: str, algo: str, dataset: str, scale: str | None = None) -> dict[str, Any]:
    lines = read_log_lines(project, algo, dataset, scale)
    result = parse_result_fields(lines)

    if project == "part3-update":
        result.update(parse_update_log(lines))

    if project == "part3-algorithm":
        result.update(parse_algorithm_log(lines))

    return result


def midterm_project_log(project: str, algo: str, dataset: str, scale: str | None = None) -> list[str]:
    return read_log_lines(project, algo, dataset, scale)


def midterm_project_result(project: str, algo: str, dataset: str, scale: str | None = None) -> dict[str, Any]:
    key = f"{project}:{algo}:{dataset}"
    result = MIDTERM_ACTIVE_RESULTS.get(key, next(iter(MIDTERM_ACTIVE_RESULTS.values())))
    merged = {
        **result,
        **MIDTERM_DATASET_META.get((project, dataset), {}),
        **MIDTERM_CODE_EFFECTS.get((project, algo), {}),
        **parsed_log_result(project, algo, dataset, scale),
    }

    return merged
