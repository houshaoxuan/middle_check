from __future__ import annotations

from typing import Any


PART1_ALGORITHM_LABELS = {
    "pagerank": "PageRank",
    "kclique": "k-Clique",
    "gcn": "GCN",
}

PART1_DATASET_LABELS = {
    "rmat16": "Rmat-16",
    "rmat17": "Rmat-17",
    "rmat18": "Rmat-18",
    "rmat19": "Rmat-19",
    "rmat20": "Rmat-20",
}

PART1_RESULTS: dict[str, dict[str, dict[str, Any]]] = {
    "pagerank": {
        "rmat16": {"Vertices": 2**16, "Edges": 2**20, "ACC-Time(s)": 0.004, "Speedup": 7.47603, "GTSPS": 7.47603},
        "rmat17": {"Vertices": 2**17, "Edges": 2**21, "ACC-Time(s)": 0.009, "Speedup": 6.65543, "GTSPS": 6.65543},
        "rmat18": {"Vertices": 2**18, "Edges": 2**21, "ACC-Time(s)": 0.009, "Speedup": 6.617, "GTSPS": 6.617},
        "rmat19": {"Vertices": 2**19, "Edges": 2**22, "ACC-Time(s)": 0.036, "Speedup": 6.102, "GTSPS": 6.102},
        "rmat20": {"Vertices": 2**20, "Edges": 2**23, "ACC-Time(s)": 0.034, "Speedup": 6.141, "GTSPS": 6.141},
    },
    "kclique": {
        "rmat16": {"Vertices": 2**16, "Edges": 2**20, "ACC-Time(s)": 0.048, "Speedup": 2.525, "GTSPS": 2.525},
        "rmat17": {"Vertices": 2**17, "Edges": 2**21, "ACC-Time(s)": 0.127, "Speedup": 2.531, "GTSPS": 2.531},
        "rmat18": {"Vertices": 2**18, "Edges": 2**21, "ACC-Time(s)": 0.118, "Speedup": 2.308, "GTSPS": 2.308},
        "rmat19": {"Vertices": 2**19, "Edges": 2**22, "ACC-Time(s)": 0.371, "Speedup": 2.054, "GTSPS": 2.054},
        "rmat20": {"Vertices": 2**20, "Edges": 2**23, "ACC-Time(s)": 0.796, "Speedup": 2.495, "GTSPS": 2.495},
    },
    "gcn": {
        "rmat16": {"Vertices": 2**16, "Edges": 2**20, "ACC-Time(s)": 0.442, "Speedup": 10, "GTSPS": 1.227},
        "rmat17": {"Vertices": 2**17, "Edges": 2**21, "ACC-Time(s)": 0.884, "Speedup": 10, "GTSPS": 1.227},
        "rmat18": {"Vertices": 2**18, "Edges": 2**21, "ACC-Time(s)": 1.506, "Speedup": 10, "GTSPS": 1.328},
        "rmat19": {"Vertices": 2**19, "Edges": 2**22, "ACC-Time(s)": 2.971, "Speedup": 10, "GTSPS": 1.283},
        "rmat20": {"Vertices": 2**20, "Edges": 2**23, "ACC-Time(s)": 6.023, "Speedup": 10, "GTSPS": 1.329},
    },
}

MIDTERM_ACTIVE_RESULTS: dict[str, dict[str, Any]] = {
    "part2:pagerank:graph1": {
        "algorithm": "PageRank",
        "dataset": "Graph1",
        "performanceTarget": 8,
        "performance": 29.50,
        "completionRate": 196.67,
        "status": "已超额完成",
    },
    "part2:pagerank:graph2": {
        "algorithm": "PageRank",
        "dataset": "Graph2",
        "performanceTarget": 8,
        "performance": 24.79,
        "completionRate": 165.27,
        "status": "已超额完成",
    },
    "part2:bfs:graph1": {
        "algorithm": "BFS",
        "dataset": "Graph1",
        "performanceTarget": 8,
        "performance": 30.56,
        "completionRate": 203.73,
        "status": "已超额完成",
    },
    "part2:bfs:graph2": {
        "algorithm": "BFS",
        "dataset": "Graph2",
        "performanceTarget": 8,
        "performance": 27.78,
        "completionRate": 185.20,
        "status": "已超额完成",
    },
    "part2:cc:graph1": {
        "algorithm": "CC",
        "dataset": "Graph1",
        "performanceTarget": 8,
        "performance": 31.33,
        "completionRate": 208.87,
        "status": "已超额完成",
    },
    "part2:cc:graph2": {
        "algorithm": "CC",
        "dataset": "Graph2",
        "performanceTarget": 8,
        "performance": 29.28,
        "completionRate": 195.20,
        "status": "已超额完成",
    },
    "part3:pagerank:default": {
        "algorithm": "PageRank",
        "resourceReductionTarget": 10,
        "graflexClbPerMteps": 7.15,
        "dfgraphClbPerMteps": 3.51,
        "resourceReduction": 50.91,
        "completionRate": 254.55,
        "status": "已超额完成",
    },
    "part3:bfs:default": {
        "algorithm": "BFS",
        "resourceReductionTarget": 10,
        "graflexClbPerMteps": 3.75,
        "dfgraphClbPerMteps": 2.36,
        "resourceReduction": 37.07,
        "completionRate": 185.33,
        "status": "已超额完成",
    },
    "part3:cc:default": {
        "algorithm": "CC",
        "resourceReductionTarget": 10,
        "graflexClbPerMteps": 3.98,
        "dfgraphClbPerMteps": 2.34,
        "resourceReduction": 41.21,
        "completionRate": 206.03,
        "status": "已超额完成",
    },
    "part4-update:graph-update:graph1": {
        "algorithm": "图更新性能展示",
        "dataset": "Graph1",
        "updateThroughputTarget": 0.10,
        "updateThroughput": 1.91,
        "completionRate": 191.00,
        "status": "已达到亿级边更新吞吐",
    },
    "part4-update:graph-update:graph2": {
        "algorithm": "图更新性能展示",
        "dataset": "Graph2",
        "updateThroughputTarget": 0.10,
        "updateThroughput": 2.18,
        "completionRate": 218.00,
        "status": "已达到亿级边更新吞吐",
    },
    "part4-algorithm:pagerank:graph1": {
        "algorithm": "PageRank",
        "dataset": "Graph1",
        "performanceTarget": 3,
        "performance": 3.61,
        "completionRate": 72.20,
        "status": "已完成中期指标",
    },
    "part4-algorithm:bfs:graph1": {
        "algorithm": "BFS",
        "dataset": "Graph1",
        "performanceTarget": 3,
        "performance": 3.15,
        "completionRate": 63.00,
        "status": "已完成中期指标",
    },
    "part4-algorithm:cc:graph1": {
        "algorithm": "CC",
        "dataset": "Graph1",
        "performanceTarget": 3,
        "performance": 3.27,
        "completionRate": 65.40,
        "status": "已完成中期指标",
    },
    "part5:pagerank:default": {
        "algorithm": "PageRank",
        "codeDensityTarget": 5,
        "codeDensity": 6.45,
        "completionRate": 64.50,
        "status": "已完成中期指标",
    },
    "part5:bfs:default": {
        "algorithm": "BFS",
        "codeDensityTarget": 5,
        "codeDensity": 6.45,
        "completionRate": 64.50,
        "status": "已完成中期指标",
    },
    "part5:cc:default": {
        "algorithm": "CC",
        "codeDensityTarget": 5,
        "codeDensity": 6.45,
        "completionRate": 64.50,
        "status": "已完成中期指标",
    },
}

MIDTERM_DATASET_META: dict[tuple[str, str], dict[str, Any]] = {
    ("part2", "graph1"): {"vertices": "17.1M", "edges": "1046.9M"},
    ("part2", "graph2"): {"vertices": "16.8M", "edges": "503.3M"},
    ("part4-update", "graph1"): {"vertices": "268.4M", "edges": "16.1B", "updateScale": "0.1%-1%"},
    ("part4-update", "graph2"): {"vertices": "536.9M", "edges": "4.4B", "updateScale": "0.1%-1%"},
    ("part4-algorithm", "graph1"): {"vertices": "268.4M", "edges": "16.1B"},
}

MIDTERM_CODE_EFFECTS: dict[tuple[str, str], dict[str, Any]] = {
    ("part5", "pagerank"): {"hitgraphCodeLines": 129, "dfgraphCodeLines": 20},
    ("part5", "bfs"): {"hitgraphCodeLines": 129, "dfgraphCodeLines": 20},
    ("part5", "cc"): {"hitgraphCodeLines": 129, "dfgraphCodeLines": 20},
}


def part1_result(algo: str, dataset: str) -> dict[str, Any]:
    algo_key = algo.lower()
    dataset_key = dataset.lower()
    metrics = PART1_RESULTS.get(algo_key, {}).get(dataset_key)
    if metrics is None:
        metrics = PART1_RESULTS["pagerank"]["rmat16"]
        algo_key = "pagerank"
        dataset_key = "rmat16"

    return {
        "Algorithm": PART1_ALGORITHM_LABELS[algo_key],
        "Dataset": PART1_DATASET_LABELS[dataset_key],
        **metrics,
    }


def execution_log(title: str, algo: str | None = None, dataset: str | None = None) -> list[str]:
    subject = " / ".join(item for item in [algo, dataset] if item)
    prefix = f"{title}: {subject}" if subject else title
    return [
        prefix,
        "加载本地模拟数据...",
        "初始化运行环境...",
        "执行图计算流程...",
        "整理运行结果...",
    ]


def midterm_project_log(project: str, algo: str, dataset: str) -> list[str]:
    key = f"{project}:{algo}:{dataset}"
    result = MIDTERM_ACTIVE_RESULTS.get(key)
    if result is None:
        return [
            f"> 加载验收配置：{project} / {algo} / {dataset}",
            "> 初始化本地模拟后端",
            "> 执行中期验收指标测试",
            "> 汇总模拟日志与指标结果",
        ]

    subject = " / ".join(str(item) for item in [result.get("algorithm"), result.get("dataset")] if item)
    return [
        f"> 加载验收任务：{subject}",
        "> 初始化本地模拟运行环境",
        "> 执行指标采集与结果核验",
        "> 写入后端模拟结果",
    ]


def midterm_project_result(project: str, algo: str, dataset: str) -> dict[str, Any]:
    key = f"{project}:{algo}:{dataset}"
    result = MIDTERM_ACTIVE_RESULTS.get(key, next(iter(MIDTERM_ACTIVE_RESULTS.values())))
    return {
        **result,
        **MIDTERM_DATASET_META.get((project, dataset), {}),
        **MIDTERM_CODE_EFFECTS.get((project, algo), {}),
    }
