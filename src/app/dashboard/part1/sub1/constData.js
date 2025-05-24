
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
      'CPU-Time(s)': 12.345,
      'ACC-Time(s)': 3.456,
      'Speedup': 3.57,
      'GTSPS': 7.234
    },
    {
      Algorithm: 'PageRank',
      Dataset: 'Rmat-17',
      Vertices: Math.pow(2, 17),
      Edges: Math.pow(2, 21),
      'CPU-Time(s)': 24.567,
      'ACC-Time(s)': 6.789,
      'Speedup': 3.62,
      'GTSPS': 7.456
    },
    {
      Algorithm: 'PageRank',
      Dataset: 'Rmat-18',
      Vertices: Math.pow(2, 18),
      Edges: Math.pow(2, 22),
      'CPU-Time(s)': 48.901,
      'ACC-Time(s)': 13.456,
      'Speedup': 3.63,
      'GTSPS': 7.567
    },
    {
      Algorithm: 'PageRank',
      Dataset: 'Rmat-19',
      Vertices: Math.pow(2, 19),
      Edges: Math.pow(2, 23),
      'CPU-Time(s)': 97.654,
      'ACC-Time(s)': 26.789,
      'Speedup': 3.65,
      'GTSPS': 7.678
    },
    {
      Algorithm: 'PageRank',
      Dataset: 'Rmat-20',
      Vertices: Math.pow(2, 20),
      Edges: Math.pow(2, 24),
      'CPU-Time(s)': 195.432,
      'ACC-Time(s)': 53.456,
      'Speedup': 3.66,
      'GTSPS': 7.789
    }
  ],
  'k-Clique': [
    {
      Algorithm: 'k-Clique',
      Dataset: 'Rmat-16',
      Vertices: Math.pow(2, 16),
      Edges: Math.pow(2, 20),
      'CPU-Time(s)': 15.678,
      'ACC-Time(s)': 5.432,
      'Speedup': 2.89,
      'GTSPS': 1.876
    },
    {
      Algorithm: 'k-Clique',
      Dataset: 'Rmat-17',
      Vertices: Math.pow(2, 17),
      Edges: Math.pow(2, 21),
      'CPU-Time(s)': 31.234,
      'ACC-Time(s)': 10.876,
      'Speedup': 2.87,
      'GTSPS': 1.890
    },
    {
      Algorithm: 'k-Clique',
      Dataset: 'Rmat-18',
      Vertices: Math.pow(2, 18),
      Edges: Math.pow(2, 22),
      'CPU-Time(s)': 62.345,
      'ACC-Time(s)': 21.654,
      'Speedup': 2.88,
      'GTSPS': 1.901
    },
    {
      Algorithm: 'k-Clique',
      Dataset: 'Rmat-19',
      Vertices: Math.pow(2, 19),
      Edges: Math.pow(2, 23),
      'CPU-Time(s)': 124.567,
      'ACC-Time(s)': 43.210,
      'Speedup': 2.88,
      'GTSPS': 1.912
    },
    {
      Algorithm: 'k-Clique',
      Dataset: 'Rmat-20',
      Vertices: Math.pow(2, 20),
      Edges: Math.pow(2, 24),
      'CPU-Time(s)': 249.012,
      'ACC-Time(s)': 86.543,
      'Speedup': 2.88,
      'GTSPS': 1.923
    }
  ],
  'GCN': [
    {
      Algorithm: 'GCN',
      Dataset: 'Rmat-16',
      Vertices: Math.pow(2, 16),
      Edges: Math.pow(2, 20),
      'CPU-Time(s)': 18.901,
      'ACC-Time(s)': 8.234,
      'Speedup': 2.30,
      'GTSPS': 1.234
    },
    {
      Algorithm: 'GCN',
      Dataset: 'Rmat-17',
      Vertices: Math.pow(2, 17),
      Edges: Math.pow(2, 21),
      'CPU-Time(s)': 37.654,
      'ACC-Time(s)': 16.789,
      'Speedup': 2.24,
      'GTSPS': 1.245
    },
    {
      Algorithm: 'GCN',
      Dataset: 'Rmat-18',
      Vertices: Math.pow(2, 18),
      Edges: Math.pow(2, 22),
      'CPU-Time(s)': 75.123,
      'ACC-Time(s)': 33.456,
      'Speedup': 2.25,
      'GTSPS': 1.256
    },
    {
      Algorithm: 'GCN',
      Dataset: 'Rmat-19',
      Vertices: Math.pow(2, 19),
      Edges: Math.pow(2, 23),
      'CPU-Time(s)': 150.234,
      'ACC-Time(s)': 66.789,
      'Speedup': 2.25,
      'GTSPS': 1.267
    },
    {
      Algorithm: 'GCN',
      Dataset: 'Rmat-20',
      Vertices: Math.pow(2, 20),
      Edges: Math.pow(2, 24),
      'CPU-Time(s)': 300.456,
      'ACC-Time(s)': 133.567,
      'Speedup': 2.25,
      'GTSPS': 1.278
    }
  ]
};



