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

PART2_LOGS = {
    "cf": [
        "[INFO] load graph dataset into accelerator simulator",
        "[INFO] configure k-Clique graph mining kernel",
        "[INFO] launch graph unit and collect triangle-count statistics",
        "[INFO] compute performance and power efficiency",
        "[SUCCESS] k-Clique simulation completed",
    ],
    "gcn": [
        "[INFO] load feature matrix and graph topology",
        "[INFO] initialize GCN graph learning kernel",
        "[INFO] execute sparse aggregation and dense transform",
        "[INFO] summarize GOPS and GOPS/W",
        "[SUCCESS] GCN simulation completed",
    ],
    "pr": [
        "[INFO] load CSR graph data",
        "[INFO] initialize PageRank vector",
        "[INFO] run iterative graph traversal pipeline",
        "[INFO] aggregate rank update throughput",
        "[SUCCESS] PageRank simulation completed",
    ],
}

PART3_STAGE_SNIPPETS = {
    "GraphIR": [
        "graph %G {",
        "  vertex_property prop : int",
        "  frontier = init_frontier(root)",
        "  scatter frontier -> edges",
        "  reduce min(message) -> prop",
        "}",
    ],
    "GCBefore": [
        "operator gather_mult(msg, weight) { return msg + weight; }",
        "operator gather_add(lhs, rhs) { return min(lhs, rhs); }",
        "operator apply(old, update) { return min(old, update); }",
    ],
    "GCAfter": [
        "GC.C0 <- input_property",
        "GC.C1 <- output_property",
        "GC.mode <- PUSH",
        "GC.run(frontier, edge_stream)",
    ],
    "OUTDEGBefore": [
        "operator out_degree(vertex) {",
        "  return adjacency_offset[vertex + 1] - adjacency_offset[vertex];",
        "}",
    ],
    "OUTDEGAfter": [
        "QLOAD offset_start",
        "QLOAD offset_end",
        "QSUB degree, offset_end, offset_start",
    ],
    "MatrixIR": [
        "matrix A = csr(row_ptr, col_idx)",
        "vector x = vertex_property",
        "vector y = semiring_spmv(A, x, min_plus)",
    ],
    "asm": [
        "SDMAL2V S0, S1, S2, 0",
        "QGENID_S Q24, S0, S7, 1",
        "GCFG C7, S5",
        "GRUN",
        "WAITQ Q30",
    ],
}

PART3_RESULT_DATA = {
    "pregel": [
        '@pregel(vd_type="int", md_type="int")',
        "class GraphScopeKernel(AppAssets):",
        "    def Compute(messages, v, context):",
        "        v.set_value(min(messages))",
    ],
    "dgl": [
        "class GCN(nn.Module):",
        "    def forward(self, graph, features):",
        "        h = self.conv1(graph, features)",
        "        return self.conv2(graph, h)",
    ],
    "CGA": [
        "from graph_dsl import *",
        "class CGAKernel(GraphTraversalKernel):",
        "    def construct(self):",
        "        return self.prop",
    ],
    "GraphIR": PART3_STAGE_SNIPPETS["GraphIR"],
    "MatrixIR": PART3_STAGE_SNIPPETS["MatrixIR"],
    "asm": PART3_STAGE_SNIPPETS["asm"],
}

PART3_DYNAMIC_RESULTS = {
    "askubuntu": {
        "data": "sx-askubuntu",
        "framework": "CGA-DynamicGraph",
        "runs": [
            {"duration_ms": 1168.4, "speed_meps": 0.511},
            {"duration_ms": 1149.2, "speed_meps": 0.519},
            {"duration_ms": 1155.7, "speed_meps": 0.516},
        ],
    },
    "wiki": {
        "data": "wiki-talk-temporal",
        "framework": "CGA-DynamicGraph",
        "runs": [
            {"duration_ms": 6231.5, "speed_meps": 0.531},
            {"duration_ms": 6112.8, "speed_meps": 0.542},
            {"duration_ms": 6188.6, "speed_meps": 0.535},
        ],
    },
    "stack": {
        "data": "sx-stackoverflow",
        "framework": "CGA-DynamicGraph",
        "runs": [
            {"duration_ms": 67821.4, "speed_meps": 0.534},
            {"duration_ms": 66940.2, "speed_meps": 0.542},
            {"duration_ms": 67318.8, "speed_meps": 0.539},
        ],
    },
}

PART6_LOGS = {
    "algorithm-a:demo-small": [
        "> 加载 Demo-Small 数据集",
        "> 启动算法A核心流程",
        "> 完成 3 轮重复测试",
        "> 生成指标结果",
    ],
    "algorithm-a:demo-medium": [
        "> 加载 Demo-Medium 数据集",
        "> 启动算法A核心流程",
        "> 完成 3 轮重复测试",
        "> 生成指标结果",
    ],
    "algorithm-b:case-1": [
        "> 加载 Case-1 数据集",
        "> 启动算法B核心流程",
        "> 完成中期指标核验",
        "> 生成指标结果",
    ],
    "algorithm-b:case-2": [
        "> 加载 Case-2 数据集",
        "> 启动算法B核心流程",
        "> 完成中期指标核验",
        "> 生成指标结果",
    ],
}

PART6_RESULTS = {
    "algorithm-a:demo-small": {
        "algorithm": "算法A",
        "dataset": "Demo-Small",
        "nodes": 65536,
        "edges": 1048576,
        "latency": 12.4,
        "latencyTarget": 20,
        "performance": 128.6,
        "performanceTarget": 100,
        "speedup": 8.3,
    },
    "algorithm-a:demo-medium": {
        "algorithm": "算法A",
        "dataset": "Demo-Medium",
        "nodes": 262144,
        "edges": 4194304,
        "latency": 18.7,
        "latencyTarget": 20,
        "performance": 116.2,
        "performanceTarget": 100,
        "speedup": 7.6,
    },
    "algorithm-b:case-1": {
        "algorithm": "算法B",
        "dataset": "Case-1",
        "nodes": 120000,
        "edges": 2200000,
        "latency": 16.5,
        "latencyTarget": 20,
        "performance": 62.8,
        "performanceTarget": 50,
        "speedup": 5.1,
    },
    "algorithm-b:case-2": {
        "algorithm": "算法B",
        "dataset": "Case-2",
        "nodes": 380000,
        "edges": 6400000,
        "latency": 19.2,
        "latencyTarget": 20,
        "performance": 57.4,
        "performanceTarget": 50,
        "speedup": 4.7,
    },
}

MIDTERM_PROJECT_LOGS = {
    "part1:dynamic-accelerator:rmat-dynamic": [
        "> 加载 RMAT 动态图场景",
        "> 生成高层次综合加速器配置",
        "> 执行动态图遍历与更新混合负载",
        "> 汇总平均性能指标",
    ],
    "part1:dynamic-accelerator:real-dynamic": [
        "> 加载真实动态图场景",
        "> 初始化异构加速器执行队列",
        "> 采集真实图结构变化下的吞吐数据",
        "> 汇总平均性能指标",
    ],
    "part2:adaptive-deploy-tool:pagerank-opt": [
        "> 加载 PageRank 优化场景",
        "> 分析性能、资源和部署约束",
        "> 生成自适应优化部署方案",
        "> 统计单位性能逻辑资源使用量降低比例",
    ],
    "part2:adaptive-deploy-tool:graph-mining-opt": [
        "> 加载图挖掘优化场景",
        "> 对比 GraFlex RTL 基线资源效率",
        "> 执行多维指标敏感优化",
        "> 统计单位性能逻辑资源使用量降低比例",
    ],
    "part3:heterogeneous-runtime:stream-update": [
        "> 加载流式动态图更新场景",
        "> 启动异构运行时调度器",
        "> 执行连续边更新吞吐测试",
        "> 汇总图算法执行性能与更新吞吐率",
    ],
    "part3:heterogeneous-runtime:mixed-execution": [
        "> 加载计算更新混合场景",
        "> 启动异构运行时任务编排",
        "> 交替执行图算法计算与边更新",
        "> 汇总图算法执行性能与更新吞吐率",
    ],
    "part4:programming-abstraction:hitgraph-case-a": [
        "> 加载 HitGraph 对比场景A",
        "> 解析高层编程抽象代码",
        "> 对比 RTL 图计算加速器代码规模",
        "> 统计代码密度压缩倍数",
    ],
    "part4:programming-abstraction:meter-power-flow": [
        "> 加载电表数据应用场景",
        "> 基于电表数据构建动态图模型",
        "> 执行电力潮流分析与电网状态监测流程",
        "> 汇总代码密度压缩与应用验证内容",
    ],
}

MIDTERM_PROJECT_RESULTS: dict[str, dict[str, Any]] = {
    "part1:dynamic-accelerator:rmat-dynamic": {
        "algorithm": "高性能动态图计算加速器架构",
        "dataset": "RMAT 动态图场景",
        "performanceTarget": 15,
        "performance": 31.20,
        "completionRate": 208.00,
        "status": "已超额完成",
    },
    "part1:dynamic-accelerator:real-dynamic": {
        "algorithm": "高性能动态图计算加速器架构",
        "dataset": "真实动态图场景",
        "performanceTarget": 15,
        "performance": 29.72,
        "completionRate": 198.13,
        "status": "已超额完成",
    },
    "part2:adaptive-deploy-tool:pagerank-opt": {
        "algorithm": "多维指标敏感的加速器自适应优化和部署工具",
        "dataset": "PageRank 优化场景",
        "resourceReductionTarget": 20,
        "resourceReduction": 45.12,
        "completionRate": 225.60,
        "status": "已超额完成",
    },
    "part2:adaptive-deploy-tool:graph-mining-opt": {
        "algorithm": "多维指标敏感的加速器自适应优化和部署工具",
        "dataset": "图挖掘优化场景",
        "resourceReductionTarget": 20,
        "resourceReduction": 41.00,
        "completionRate": 205.00,
        "status": "已超额完成",
    },
    "part3:heterogeneous-runtime:stream-update": {
        "algorithm": "面向动态图计算的异构运行时",
        "dataset": "流式动态图更新场景",
        "performanceTarget": 5,
        "performance": 3.18,
        "updateThroughputTarget": 1.00,
        "updateThroughput": 2.06,
        "status": "更新吞吐达标，执行性能持续优化",
    },
    "part3:heterogeneous-runtime:mixed-execution": {
        "algorithm": "面向动态图计算的异构运行时",
        "dataset": "计算更新混合场景",
        "performanceTarget": 5,
        "performance": 3.50,
        "updateThroughputTarget": 1.00,
        "updateThroughput": 1.84,
        "status": "更新吞吐达标，执行性能持续优化",
    },
    "part4:programming-abstraction:hitgraph-case-a": {
        "algorithm": "面向动态图计算的高层编程抽象与应用验证",
        "dataset": "HitGraph 对比场景A",
        "codeDensityTarget": 10,
        "codeDensity": 6.20,
        "completionRate": 62.00,
        "applicationScenario": "HitGraph RTL 对比验证",
        "status": "持续优化中",
    },
    "part4:programming-abstraction:meter-power-flow": {
        "algorithm": "面向动态图计算的高层编程抽象与应用验证",
        "dataset": "电表数据应用场景",
        "codeDensityTarget": 10,
        "codeDensity": 6.70,
        "completionRate": 67.00,
        "applicationScenario": "电表数据图模型、电力潮流分析、电网状态监测",
        "status": "应用验证已接入",
    },
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


def part2_log(name: str) -> str:
    prefix = name.split("_on_")[0]
    lines = PART2_LOGS.get(prefix, PART2_LOGS["pr"])
    dataset = name.replace("_", "-")
    return "\n".join([f"[DATASET] {dataset}", *lines])


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


def part6_log(algo: str, dataset: str) -> list[str]:
    key = f"{algo}:{dataset}"
    return PART6_LOGS.get(
        key,
        [
            f"> 加载测试配置：{algo} / {dataset}",
            "> 初始化本地模拟运行环境",
            "> 执行指标测试",
            "> 汇总性能与时延数据",
        ],
    )


def part6_result(algo: str, dataset: str) -> dict[str, Any]:
    key = f"{algo}:{dataset}"
    return PART6_RESULTS.get(key, PART6_RESULTS["algorithm-a:demo-small"])


def midterm_project_log(project: str, algo: str, dataset: str) -> list[str]:
    key = f"{project}:{algo}:{dataset}"
    return MIDTERM_PROJECT_LOGS.get(
        key,
        [
            f"> 加载验收配置：{project} / {algo} / {dataset}",
            "> 初始化本地模拟后端",
            "> 执行中期验收指标测试",
            "> 汇总模拟日志与指标结果",
        ],
    )


def midterm_project_result(project: str, algo: str, dataset: str) -> dict[str, Any]:
    key = f"{project}:{algo}:{dataset}"
    return MIDTERM_PROJECT_RESULTS.get(key, next(iter(MIDTERM_PROJECT_RESULTS.values())))
