from __future__ import annotations

from typing import Any

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

UPDATE_THROUGHPUT_BY_SCALE = {
    ("graph1", "0.1"): 1.91,
    ("graph1", "0.5"): 1.86,
    ("graph1", "1"): 1.79,
    ("graph2", "0.1"): 2.18,
    ("graph2", "0.5"): 2.12,
    ("graph2", "1"): 2.04,
}


def midterm_project_log(project: str, algo: str, dataset: str, scale: str | None = None) -> list[str]:
    key = f"{project}:{algo}:{dataset}"
    result = MIDTERM_ACTIVE_RESULTS.get(key)
    if result is None:
        return [
            f"> 加载验收配置：{project} / {algo} / {dataset}",
            "> 初始化本地模拟后端",
            "> 执行中期验收指标测试",
            "> 汇总模拟日志与指标结果",
        ]

    scale_label = UPDATE_SCALE_LABELS.get(scale or "") if project == "part3-update" else None
    subject = " / ".join(str(item) for item in [result.get("algorithm"), result.get("dataset"), scale_label] if item)
    return [
        f"> 加载验收任务：{subject}",
        "> 初始化本地模拟运行环境",
        "> 执行指标采集与结果核验",
        "> 写入后端模拟结果",
    ]


def midterm_project_result(project: str, algo: str, dataset: str, scale: str | None = None) -> dict[str, Any]:
    key = f"{project}:{algo}:{dataset}"
    result = MIDTERM_ACTIVE_RESULTS.get(key, next(iter(MIDTERM_ACTIVE_RESULTS.values())))
    merged = {
        **result,
        **MIDTERM_DATASET_META.get((project, dataset), {}),
        **MIDTERM_CODE_EFFECTS.get((project, algo), {}),
    }

    if project == "part3-update" and scale in UPDATE_SCALE_LABELS:
        return {
            **merged,
            "updateScale": UPDATE_SCALE_LABELS[scale],
            "updateThroughput": UPDATE_THROUGHPUT_BY_SCALE.get((dataset, scale), merged.get("updateThroughput")),
        }

    return merged
