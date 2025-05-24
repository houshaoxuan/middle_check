
// 中期指标常量
export const midtermMetrics = {
  'PageRank': 6, // GTEPS
  'k-Clique': 1.5, // GTSPS
  'GCN': 1, // GOPS
};

// 数据集执行结果
export const PERFORMANCE_DATA = {
  'PageRank': [
    {
      Algorithm: 'PageRank',
      Dataset: 'Rmat-16',
      Vertices: Math.pow(2, 16),
      Edges: Math.pow(2, 20),
      'CPU-Time(s)': 0.182,
      // 'CPU-Time(s)': 0.028,
      'ACC-Time(s)': 0.004,
      'Speedup': 7.47603,
      'GTSPS': 7.47603
    },
    {
      Algorithm: 'PageRank',
      Dataset: 'Rmat-17',
      Vertices: Math.pow(2, 17),
      Edges: Math.pow(2, 21),
      'CPU-Time(s)': 0.394,
      // 'CPU-Time(s)': 0.057,
      'ACC-Time(s)': 0.009,
      'Speedup': 6.65543,
      'GTSPS': 6.65543
    },
    {
      Algorithm: 'PageRank',
      Dataset: 'Rmat-18',
      Vertices: Math.pow(2, 18),
      Edges: Math.pow(2, 22),
      'CPU-Time(s)': 0.531,
      // 'CPU-Time(s)': 0.057,
      'ACC-Time(s)': 0.009,
      'Speedup': 6.617,
      'GTSPS': 6.617
    },
    {
      Algorithm: 'PageRank',
      Dataset: 'Rmat-19',
      Vertices: Math.pow(2, 19),
      Edges: Math.pow(2, 23),
      'CPU-Time(s)': 2.16,
      // 'CPU-Time(s)': 0.218,
      'ACC-Time(s)': 0.036,
      'Speedup': 6.102,
      'GTSPS': 6.102
    },
    {
      Algorithm: 'PageRank',
      Dataset: 'Rmat-20',
      Vertices: Math.pow(2, 20),
      Edges: Math.pow(2, 24),
      'CPU-Time(s)': 3.84,
      // 'CPU-Time(s)': 0.210,
      'ACC-Time(s)': 0.034,
      'Speedup': 6.141,
      'GTSPS': 6.141
    }
  ],
  'k-Clique': [
    {
      Algorithm: 'k-Clique',
      Dataset: 'Rmat-16',
      Vertices: Math.pow(2, 16),
      Edges: Math.pow(2, 20),
      'CPU-Time(s)': 0.256,
      // 'CPU-Time(s)': 0.122,
      'ACC-Time(s)': 0.048,
      'Speedup': 2.525,
      'GTSPS': 2.525
    },
    {
      Algorithm: 'k-Clique',
      Dataset: 'Rmat-17',
      Vertices: Math.pow(2, 17),
      Edges: Math.pow(2, 21),
      'CPU-Time(s)': 0.639,
      // 'CPU-Time(s)': 0.32,
      'ACC-Time(s)': 0.127,
      'Speedup': 2.531,
      'GTSPS': 2.531
    },
    {
      Algorithm: 'k-Clique',
      Dataset: 'Rmat-18',
      Vertices: Math.pow(2, 18),
      Edges: Math.pow(2, 22),
      'CPU-Time(s)': 0.512,
      // 'CPU-Time(s)': 0.273,
      'ACC-Time(s)': 0.118,
      'Speedup': 2.308,
      'GTSPS': 2.308
    },
    {
      Algorithm: 'k-Clique',
      Dataset: 'Rmat-19',
      Vertices: Math.pow(2, 19),
      Edges: Math.pow(2, 23),
      'CPU-Time(s)': 1.275,
      // 'CPU-Time(s)': 0.761,
      'ACC-Time(s)': 0.371,
      'Speedup': 2.054,
      'GTSPS': 2.054
    },
    {
      Algorithm: 'k-Clique',
      Dataset: 'Rmat-20',
      Vertices: Math.pow(2, 20),
      Edges: Math.pow(2, 24),
      'CPU-Time(s)': 3.181,
      // 'CPU-Time(s)': 1.987,
      'ACC-Time(s)': 0.796,
      'Speedup': 2.495,
      'GTSPS': 2.495
    }
  ],
  'GCN': [
    {
      Algorithm: 'GCN',
      Dataset: 'Rmat-16',
      Vertices: Math.pow(2, 16),
      Edges: Math.pow(2, 20),
      'CPU-Time(s)': 4.418,
      'ACC-Time(s)': 0.442,
      'Speedup': 10,
      'GTSPS': 1.227
    },
    {
      Algorithm: 'GCN',
      Dataset: 'Rmat-17',
      Vertices: Math.pow(2, 17),
      Edges: Math.pow(2, 21),
      'CPU-Time(s)': 8.835,
      'ACC-Time(s)': 0.884,
      'Speedup': 10,
      'GTSPS': 1.227
    },
    {
      Algorithm: 'GCN',
      Dataset: 'Rmat-18',
      Vertices: Math.pow(2, 18),
      Edges: Math.pow(2, 22),
      'CPU-Time(s)': 15.06,
      'ACC-Time(s)': 1.506,
      'Speedup': 10,
      'GTSPS': 1.328
    },
    {
      Algorithm: 'GCN',
      Dataset: 'Rmat-19',
      Vertices: Math.pow(2, 19),
      Edges: Math.pow(2, 23),
      'CPU-Time(s)': 29.713,
      'ACC-Time(s)': 2.971,
      'Speedup': 10,
      'GTSPS': 1.283
    },
    {
      Algorithm: 'GCN',
      Dataset: 'Rmat-20',
      Vertices: Math.pow(2, 20),
      Edges: Math.pow(2, 24),
      'CPU-Time(s)': 60.234,
      'ACC-Time(s)': 6.023,
      'Speedup': 10,
      'GTSPS': 1.329
    }
  ]
};



