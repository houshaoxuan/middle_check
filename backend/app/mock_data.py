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

