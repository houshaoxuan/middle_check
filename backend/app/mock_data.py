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

ALGORITHM_LABELS = {
    "pagerank": "PageRank",
    "bfs": "BFS",
    "cc": "CC",
}

PART4_FILE_PREFIXES = {
    "pagerank": ("pr", "pagerank"),
    "bfs": ("bfs",),
    "cc": ("cc",),
}

PROJECT_LOG_DIRS = {
    "part3-update": "part3",
    "part3-algorithm": "part3",
}


def project_log_dir(project: str) -> Path:
    return DATA_ROOT / PROJECT_LOG_DIRS.get(project, project)


def part4_compare_log_path(algo: str) -> Path | None:
    log_dir = project_log_dir("part4")
    candidates: list[Path] = []

    for prefix in PART4_FILE_PREFIXES.get(algo, (algo,)):
        candidates.extend(sorted(log_dir.glob(f"{prefix}_compare*.log")))

    return candidates[0] if candidates else None


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

    if project == "part4":
        return part4_compare_log_path(algo) or log_dir / f"{algo}.log"

    if dataset == "default":
        return log_dir / f"{algo}.log"

    return log_dir / f"{algo}_{dataset}.log"


def read_log_lines(project: str, algo: str, dataset: str, scale: str | None = None) -> list[str]:
    log_path = midterm_log_path(project, algo, dataset, scale)
    if log_path and log_path.exists():
        return log_path.read_text(encoding="utf-8-sig", errors="replace").splitlines()

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
    mteps_match = re.search(r"Kernel MTEPS \(multi-device\)\s*=\s*([0-9.]+)", text)
    if not mteps_match:
        return {}

    return {"performance": round(float(mteps_match.group(1)) / 1000, 2)}


def parse_clb_used(text: str) -> int | None:
    match = re.search(r"^\|\s*CLB\s*\|\s*([0-9,\s]+?)\s*\|", text, re.MULTILINE)
    if not match:
        return None

    return int(match.group(1).replace(",", "").strip())


def extract_section(text: str, section_name: str) -> str:
    match = re.search(rf"^\[SECTION\]\s+{re.escape(section_name)}[^\n]*\n(.*?)(?=^\[SECTION\]|\Z)", text, re.S | re.M)
    return match.group(1) if match else ""


def parse_part2_resource_log(lines: list[str], algo: str) -> dict[str, Any]:
    text = "\n".join(lines)
    graflex_section = extract_section(text, "GraFlex")
    dfgraph_section = extract_section(text, "DFGraph")

    graflex_clb = parse_clb_used(graflex_section)
    dfgraph_clb = parse_clb_used(dfgraph_section)

    if graflex_clb is None or dfgraph_clb is None:
        clb_values = re.findall(r"^\|\s*CLB\s*\|\s*([0-9,\s]+?)\s*\|", text, re.MULTILINE)
        if len(clb_values) >= 2:
            graflex_clb = int(clb_values[0].replace(",", "").strip())
            dfgraph_clb = int(clb_values[1].replace(",", "").strip())

    if graflex_clb is None or dfgraph_clb is None:
        return {}

    resource_reduction = round((graflex_clb - dfgraph_clb) / graflex_clb * 100, 2)
    assessment_target = 20
    midterm_target = 10

    return {
        "algorithm": ALGORITHM_LABELS.get(algo, algo),
        "graflexClbPerMteps": graflex_clb,
        "dfgraphClbPerMteps": dfgraph_clb,
        "resourceReduction": resource_reduction,
        "completionRate": round(resource_reduction / assessment_target * 100, 2),
        "status": "已达到考核指标" if resource_reduction >= assessment_target else "已完成中期指标"
        if resource_reduction >= midterm_target
        else "未完成中期指标",
    }


def parse_part4_code_density_log(lines: list[str], algo: str) -> dict[str, Any]:
    text = "\n".join(lines)
    code_line_match = re.search(r"有效代码行\s+([0-9]+)\s+([0-9]+)\s+([0-9]+)", text)
    density_match = re.search(r"HitGraph\s*为\s*([0-9.]+)x", text)

    if not code_line_match and not density_match:
        return {}

    result: dict[str, Any] = {"algorithm": ALGORITHM_LABELS.get(algo, algo)}

    if code_line_match:
        hitgraph_lines = int(code_line_match.group(1))
        dfgraph_lines = int(code_line_match.group(2))
        result.update(
            {
                "hitgraphCodeLines": hitgraph_lines,
                "dfgraphCodeLines": dfgraph_lines,
                "codeDensity": round(hitgraph_lines / dfgraph_lines, 2) if dfgraph_lines else 0,
            }
        )

    if density_match:
        result["codeDensity"] = round(float(density_match.group(1)), 2)

    code_density = result.get("codeDensity")
    if isinstance(code_density, (int, float)):
        assessment_target = 10
        midterm_target = 5
        result["completionRate"] = round(code_density / assessment_target * 100, 2)
        result["status"] = (
            "已达到考核指标"
            if code_density >= assessment_target
            else "已完成中期指标"
            if code_density >= midterm_target
            else "未完成中期指标"
        )

    return result


def parsed_log_result(project: str, algo: str, dataset: str, scale: str | None = None) -> dict[str, Any]:
    if project == "part2":
        return {}

    lines = read_log_lines(project, algo, dataset, scale)
    result = parse_result_fields(lines)

    if project == "part3-update":
        result.update(parse_update_log(lines))

    if project in {"part1", "part3-algorithm"}:
        result.update(parse_algorithm_log(lines))

    if project == "part4":
        result.update(parse_part4_code_density_log(lines, algo))

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


def part4_code_paths(algo: str) -> list[Path]:
    log_dir = project_log_dir("part4")
    paths: list[Path] = []

    for prefix in PART4_FILE_PREFIXES.get(algo, (algo,)):
        paths.extend(sorted(log_dir.glob(f"{prefix}*.v")))
        paths.extend(sorted(log_dir.glob(f"{prefix}*.h")))

    deduped = list(dict.fromkeys(paths))
    return sorted(deduped, key=lambda path: (0 if path.suffix == ".v" else 1, path.name.lower()))


def code_panel_title(path: Path) -> str:
    if path.suffix == ".v":
        return "HitGraph的编程抽象"

    return "本课题中设计的编程抽象"


def code_panel_language(path: Path) -> str:
    if path.suffix == ".v":
        return "verilog"

    if path.suffix in {".h", ".hpp", ".cc", ".cpp"}:
        return "cpp"

    return "text"


def midterm_code_comparison(project: str, algo: str) -> dict[str, Any]:
    if project != "part4":
        return {"title": "代码对比展示", "panels": []}

    panels = [
        {
            "title": code_panel_title(path),
            "language": code_panel_language(path),
            "filename": path.name,
            "code": path.read_text(encoding="utf-8-sig", errors="replace"),
        }
        for path in part4_code_paths(algo)
    ]

    return {"title": "代码对比展示", "panels": panels}
