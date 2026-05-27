function plain(text) {
  return { text };
}

function highlight(text) {
  return { text, highlight: true };
}

function line(...parts) {
  return {
    parts: parts.map((part) => (typeof part === 'string' ? plain(part) : part)),
  };
}

const platformItems = [
  'CPU：1 颗 36-core 2-way hyper-threaded Intel Xeon 6554S CPU @ 2.20GHz；内存 2TB；缓存 180MB；g++ 编译器。',
  'FPGA：4 张 Xilinx Alveo U55C；16GB 高带宽内存（460GB/s）；AMD Vitis 编译器。',
];

const acceleratorGraph1 = {
  key: 'graph1',
  apiKey: 'graph1',
  label: 'SNAP-1',
  displayName: 'SNAP-1',
  nodes: '17.1M',
  edges: '1046.9M',
  source: '来自 SNAP 官方数据集的真实图',
  description: '用于验证高性能动态图计算加速器架构，PageRank/BFS/CC 的性能分别为 29.50、30.56、31.33 GTEPS。',
};

const acceleratorGraph2 = {
  key: 'graph2',
  apiKey: 'graph2',
  label: 'SNAP-2',
  displayName: 'SNAP-2',
  nodes: '16.8M',
  edges: '503.3M',
  source: '来自 SNAP 官方数据集的真实图',
  description: '用于验证高性能动态图计算加速器架构，PageRank/BFS/CC 的性能分别为 24.79、27.78、29.28 GTEPS。',
};

const deploymentDefaultDataset = {
  key: 'default',
  apiKey: 'default',
  label: 'GraFlex/DFGraph 对比实验',
  displayName: 'GraFlex/DFGraph 对比实验',
  nodes: '-',
  edges: '-',
  source: 'PPT 单位性能逻辑资源使用量对比',
  description: '该页面不需要选择数据集，默认使用 GraFlex 与 DFGraph 在 PageRank、BFS、CC 上的 CLB/MTEPS 对比结果。',
};

const updateGraph1 = {
  key: 'graph1',
  apiKey: 'graph1',
  label: 'RMAT-28',
  displayName: 'RMAT-28',
  nodes: '268.4M',
  edges: '16.1B',
  updateScale: '0.1%-1%',
  source: 'Graph500 基准生成器生成的 R-MAT/Kronecker 合成图',
  description: '图更新规模为 0.1%-1%，图更新吞吐率为 1.91 亿边/秒。',
};

const updateGraph2 = {
  key: 'graph2',
  apiKey: 'graph2',
  label: 'RMAT-29',
  displayName: 'RMAT-29',
  nodes: '536.9M',
  edges: '4.4B',
  updateScale: '0.1%-1%',
  source: 'Graph500 基准生成器生成的 R-MAT/Kronecker 合成图',
  description: '图更新规模为 0.1%-1%，图更新吞吐率为 2.18 亿边/秒。',
};

const algorithmGraph1 = {
  key: 'graph1',
  apiKey: 'graph1',
  label: 'RMAT-28',
  displayName: 'RMAT-28',
  nodes: '268.4M',
  edges: '16.1B',
  source: 'Graph500 基准生成器生成的 R-MAT/Kronecker 合成图',
  description: '固定用于图算法性能展示，PageRank/BFS/CC 的性能分别为 3.61、3.15、3.27 GTEPS。',
};

const abstractionDefaultDataset = {
  key: 'default',
  apiKey: 'default',
  label: 'HitGraph 代码密度对比实验',
  displayName: 'HitGraph 代码密度对比实验',
  nodes: '-',
  edges: '-',
  source: 'PPT 有效代码密度（行数）对比',
  description: '该页面不需要选择数据集，默认展示 HitGraph 与本课题编程抽象在 PageRank、BFS、CC 上的代码密度对比。',
};

function algorithm(key, label, description, datasets) {
  return {
    key,
    label,
    category: '图算法',
    description,
    midtermTarget: '服务于对应子课题的中期验收指标展示。',
    evaluation: '使用 PPT 中的实验平台、图数据集和本地后端模拟结果进行验收展示。',
    datasets,
  };
}

const graphAlgorithms = (datasets) => [
  algorithm(
    'pagerank',
    'PageRank',
    '迭代式图遍历算法，用于评估动态图加速器对全图边访问和属性更新的吞吐能力。',
    datasets
  ),
  algorithm('bfs', 'BFS', '广度优先搜索算法，用于评估动态图加速器对前沿扩展、访存和分区调度的支持能力。', datasets),
  algorithm('cc', 'CC', '连通分量算法，用于评估动态图结构分析场景下的并行更新与收敛性能。', datasets),
];

function sections({ assessment, midterm, completion, method, source }) {
  const items = [
    { title: '考核指标', items: assessment },
    { title: '中期指标', items: midterm },
    { title: '中期完成情况', items: completion },
    { title: '考核方式', items: method },
  ];

  if (source?.length > 0) {
    items.push({ title: '数据集来源', items: source });
  }

  return items;
}

export const midtermProjectConfigs = {
  part1: {
    apiBasePath: '/midterm/part1',
    allDatasetsKey: 'all',
    introSections: sections({
      assessment: [line('指标1.1：异构高性能图计算高层次综合系统综合后的加速器平均性能达到', highlight('15GTEPS'))],
      midterm: [line('指标1.1：异构高性能图计算高层次综合系统综合后的加速器平均性能达到', highlight('8GTEPS'))],
      completion: [
        line('指标1.1：异构高性能图计算高层次综合系统综合后的加速器平均性能达到', highlight('30.46GTEPS')),
      ],
      method: [
        '在 Xilinx Alveo U55C FPGA 板卡上实现所提出的高性能动态图计算加速器，运行 PageRank、BFS、CC 并统计 GTEPS。',
        ...platformItems,
      ],
      source: ['SNAP 官方数据集的真实图'],
    }),
    controls: {
      algorithmLabel: '选择算法',
      datasetLabel: '选择数据集',
    },
    algorithms: graphAlgorithms([acceleratorGraph1, acceleratorGraph2]),
    tableTitle: '动态图加速器性能结果汇总',
    tableColumns: [
      { key: 'algorithm', label: '算法' },
      { key: 'dataset', label: '数据集' },
      { key: 'vertices', label: '顶点数', align: 'right' },
      { key: 'edges', label: '边数', align: 'right' },
      { key: 'performanceTarget', label: '中期指标（GTEPS）', align: 'right' },
      { key: 'performance', label: '中期完成值（GTEPS）', align: 'right' },
      { key: 'assessmentTarget', label: '考核指标（GTEPS）', align: 'right' },
    ],
    chart: {
      title: '加速器吞吐性能对比',
      metrics: [
        {
          key: 'performance',
          label: '平均性能',
          unit: 'GTEPS',
          valueKey: 'performance',
          targetKey: 'performanceTarget',
          assessmentTarget: 15,
          midtermTarget: 8,
          defaultTarget: 15,
        },
      ],
    },
  },

  part2: {
    apiBasePath: '/midterm/part2',
    allDatasetsKey: 'all',
    introSections: sections({
      assessment: [
        line(
          '指标2.1：相比GraFlex生成的寄存器传输级（RTL）加速器，综合后的单位性能逻辑资源使用量降低',
          highlight('20%')
        ),
      ],
      midterm: [
        line(
          '指标2.1：相比GraFlex生成的寄存器传输级（RTL）加速器，综合后的单位性能逻辑资源使用量降低',
          highlight('10%')
        ),
      ],
      completion: [
        line('指标2.1：相比GraFlex生成的寄存器传输级（RTL）加速器，综合后的单位性能逻辑资源使用量降低', highlight('43.06%')),
      ],
      method: [
        '在 Xilinx Alveo U55C FPGA 板卡上使用所提出方法综合和部署动态图计算加速器（DFGraph），对比 GraFlex 与 DFGraph 的逻辑资源使用量（CLB）。',
        ...platformItems,
      ],
    }),
    controls: {
      showDatasetSelect: false,
      showDatasetInfo: false,
      algorithmLabel: '选择算法',
    },
    algorithms: graphAlgorithms([deploymentDefaultDataset]),
    tableTitle: '资源占用对比结果汇总',
    tableColumns: [
      { key: 'algorithm', label: '算法' },
      { key: 'graflexClbPerMteps', label: 'GraFlex 资源占用（CLB）', align: 'right' },
      { key: 'dfgraphClbPerMteps', label: 'DFGraph 资源占用（CLB）', align: 'right' },
      { key: 'resourceReductionTarget', label: '资源使用量降低中期指标（%）', align: 'right' },
      { key: 'resourceReduction', label: '中期完成值（%）', align: 'right' },
      { key: 'assessmentTarget', label: '考核指标（%）', align: 'right' },
    ],
    chart: {
      title: '资源使用量降低比例对比',
      metrics: [
        {
          key: 'resourceReduction',
          label: '资源降低比例',
          unit: '%',
          valueKey: 'resourceReduction',
          targetKey: 'resourceReductionTarget',
          assessmentTarget: 20,
          midtermTarget: 10,
          defaultTarget: 20,
        },
      ],
    },
  },

  part3Update: {
    apiBasePath: '/midterm/part3-update',
    allDatasetsKey: 'all',
    introSections: sections({
      assessment: [line('指标3.2：动态图更新吞吐率可达每秒', highlight('亿级边'))],
      midterm: [line('指标3.2：动态图更新吞吐率可达每秒', highlight('千万级边'))],
      completion: [line('指标3.2：动态图更新吞吐率可达每秒', highlight('1.95亿条边'))],
      method: ['在 CPU-FPGA 异构架构上实现所提出的异构运行时方法，执行动态图更新吞吐测试。', ...platformItems],
      source: ['Graph500 生成的合成图'],
    }),
    controls: {
      showAlgorithmSelect: false,
      datasetLabel: '选择数据集',
    },
    updateScaleControl: {
      enabled: true,
      label: '图更新规模',
      allKey: 'all',
      options: [
        { key: '0.1', label: '0.1%' },
        { key: '0.5', label: '0.5%' },
        { key: '1', label: '1%' },
        { key: 'all', label: '全部规模' },
      ],
    },
    algorithms: [
      {
        key: 'graph-update',
        label: '图更新性能展示',
        category: '异构运行时',
        description: '展示面向动态图计算的异构运行时在边更新场景下的吞吐性能。',
        midtermTarget: '动态图更新吞吐率达到每秒千万级边，中期完成达到每秒 1.95 亿条边。',
        evaluation: '选择 RMAT-28 或 RMAT-29 后运行，统计动态图边更新吞吐率。',
        datasets: [updateGraph1, updateGraph2],
      },
    ],
    tableTitle: '动态图更新吞吐结果汇总',
    tableColumns: [
      { key: 'dataset', label: '数据集' },
      { key: 'vertices', label: '顶点数', align: 'right' },
      { key: 'edges', label: '边数', align: 'right' },
      { key: 'updateScale', label: '图更新规模', align: 'right' },
      { key: 'updateThroughputTarget', label: '中期指标（亿边/秒）', align: 'right' },
      { key: 'updateThroughput', label: '中期完成值（亿边/秒）', align: 'right' },
      { key: 'assessmentTarget', label: '考核指标（亿边/秒）', align: 'right' },
    ],
    chart: {
      title: '图更新吞吐性能对比',
      metrics: [
        {
          key: 'updateThroughput',
          label: '更新吞吐',
          unit: '亿边/秒',
          valueKey: 'updateThroughput',
          targetKey: 'updateThroughputTarget',
          assessmentTarget: 1,
          midtermTarget: 0.1,
          defaultTarget: 1,
        },
      ],
    },
  },

  part3Algorithm: {
    apiBasePath: '/midterm/part3-algorithm',
    allDatasetsKey: 'all',
    introSections: sections({
      assessment: [line('指标3.1：图算法执行平均性能达到', highlight('5GTEPS'))],
      midterm: [line('指标3.1：图算法执行平均性能达到', highlight('3GTEPS'))],
      completion: [line('指标3.1：图算法执行平均性能达到', highlight('3.34GTEPS'))],
      method: [
        '在 CPU-FPGA 异构架构上实现所提出的异构运行时方法，在 RMAT-28 运行 PageRank、BFS、CC 并统计 GTEPS。',
        ...platformItems,
      ],
      source: ['Graph500 生成的合成图'],
    }),
    controls: {
      algorithmLabel: '选择算法',
      datasetLabel: '数据集',
      disableDatasetSelect: true,
    },
    algorithms: graphAlgorithms([algorithmGraph1]),
    tableTitle: '图算法执行性能结果汇总',
    tableColumns: [
      { key: 'algorithm', label: '算法' },
      { key: 'dataset', label: '数据集' },
      { key: 'vertices', label: '顶点数', align: 'right' },
      { key: 'edges', label: '边数', align: 'right' },
      { key: 'performanceTarget', label: '中期指标（GTEPS）', align: 'right' },
      { key: 'performance', label: '中期完成值（GTEPS）', align: 'right' },
      { key: 'assessmentTarget', label: '考核指标（GTEPS）', align: 'right' },
    ],
    chart: {
      title: '图算法执行性能对比',
      metrics: [
        {
          key: 'performance',
          label: '执行性能',
          unit: 'GTEPS',
          valueKey: 'performance',
          targetKey: 'performanceTarget',
          assessmentTarget: 5,
          midtermTarget: 3,
          defaultTarget: 5,
        },
      ],
    },
  },

  part4: {
    apiBasePath: '/midterm/part4',
    logDurationSeconds: 1,
    allDatasetsKey: 'all',
    introSections: sections({
      assessment: [
        line(
          '指标4.1：相比典型寄存器传输级（RTL）图计算加速器（HitGraph），基于高层次综合系统设计的图计算代码密度压缩',
          highlight('10倍')
        ),
        line(
          '指标4.2：针对电表数据在电力领域的应用场景，采用动态图计算技术，基于电表数据构建图模型，实现电力潮流分析和电网状态监测，确保高效稳定的省侧级电力潮流分析计算以及省级区域内负荷优化响应；同时提供面向图应用的高效易用开发工具链，基于工具链开发面向电力领域的典型应用'
        ),
      ],
      midterm: [
        line(
          '指标4.1：相比典型寄存器传输级（RTL）图计算加速器（HitGraph），基于高层次综合系统设计的图计算代码密度压缩',
          highlight('5倍')
        ),
      ],
      completion: [
        line(
          '指标4.1：相比典型寄存器传输级（RTL）图计算加速器（HitGraph），基于高层次综合系统设计的图计算代码密度压缩',
          highlight('6.45倍')
        ),
      ],
      method: [
        '对比 HitGraph 的编程抽象与本课题中设计的编程抽象，并统计有效代码密度（行数）。',
      ],
    }),
    controls: {
      showDatasetSelect: false,
      showDatasetInfo: false,
      algorithmLabel: '选择算法',
    },
    algorithms: graphAlgorithms([abstractionDefaultDataset]),
    codeComparison: {
      title: '代码对比展示',
      source: 'backend',
    },
    tableTitle: '编程抽象代码密度结果汇总',
    tableColumns: [
      { key: 'algorithm', label: '算法' },
      { key: 'hitgraphCodeLines', label: 'HitGraph 效果（行）', align: 'right' },
      { key: 'dfgraphCodeLines', label: '本课题效果（行）', align: 'right' },
      { key: 'codeDensityTarget', label: '中期指标（压缩x倍）', align: 'right' },
      { key: 'codeDensity', label: '中期完成值（压缩x倍）', align: 'right' },
      { key: 'assessmentTarget', label: '考核指标（压缩x倍）', align: 'right' },
    ],
    chart: {
      title: '代码密度压缩效果对比',
      metrics: [
        {
          key: 'codeDensity',
          label: '代码密度压缩',
          unit: '倍',
          valueKey: 'codeDensity',
          targetKey: 'codeDensityTarget',
          assessmentTarget: 10,
          midtermTarget: 5,
          defaultTarget: 10,
        },
      ],
    },
  },
};

