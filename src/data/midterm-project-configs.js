const ALL_DATASETS_KEY = 'all';

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

const commonSections = {
  method: {
    title: '考核方式',
    items: [
      '选择验证场景后点击运行，页面展示本地后端返回的模拟执行日志、指标结果表格和柱状图。',
      '该页面用于中期验收演示，后续替换配置与后端模拟数据即可迁移到其他项目。',
    ],
  },
};

export const midtermProjectConfigs = {
  part1: {
    apiBasePath: '/midterm/part1',
    allDatasetsKey: ALL_DATASETS_KEY,
    introSections: [
      {
        title: '中期考核指标',
        items: [line('指标1.1：异构高性能图计算高层次综合系统综合后的加速器平均性能达到', highlight('15GTEPS'))],
      },
      {
        title: '中期完成情况',
        items: [line('1.1 异构高性能图计算高层次综合系统综合后的加速器平均性能达到', highlight('30.46GTEPS'))],
      },
      commonSections.method,
    ],
    algorithms: [
      {
        key: 'dynamic-accelerator',
        label: '高性能动态图计算加速器架构',
        category: '子课题一',
        description:
          '展示异构高性能图计算高层次综合系统生成的动态图计算加速器架构，以及面向动态图算法的端到端执行性能。',
        midtermTarget: '平均性能达到 15GTEPS',
        evaluation: '在动态图验证场景中执行图算法，统计综合后加速器的平均吞吐性能。',
        datasets: [
          {
            key: 'rmat-dynamic',
            label: 'RMAT 动态图场景',
            nodes: '1,048,576',
            edges: '16,777,216',
            source: 'Graph500/RMAT 生成数据',
            description: '用于验证规则动态图输入下的高层次综合加速器执行性能。',
          },
          {
            key: 'real-dynamic',
            label: '真实动态图场景',
            nodes: '2,400,000',
            edges: '38,000,000',
            source: '公开真实图数据抽样',
            description: '用于验证真实动态图结构变化下的吞吐稳定性。',
          },
          { key: ALL_DATASETS_KEY, label: '全部验证场景' },
        ],
      },
    ],
    tableTitle: '高性能动态图计算加速器架构验收结果',
    tableColumns: [
      { key: 'algorithm', label: '子课题' },
      { key: 'dataset', label: '验证场景' },
      { key: 'performanceTarget', label: '目标性能(GTEPS)', align: 'right' },
      { key: 'performance', label: '完成性能(GTEPS)', align: 'right' },
      { key: 'completionRate', label: '达成率(%)', align: 'right' },
      { key: 'status', label: '状态' },
    ],
    chart: {
      title: '指标1.1 平均性能达成情况',
      metrics: [
        {
          key: 'performance',
          label: '平均性能',
          unit: 'GTEPS',
          valueKey: 'performance',
          targetKey: 'performanceTarget',
          defaultTarget: 15,
        },
      ],
    },
  },

  part2: {
    apiBasePath: '/midterm/part2',
    allDatasetsKey: ALL_DATASETS_KEY,
    introSections: [
      {
        title: '中期考核指标',
        items: [
          line(
            '指标2.1：相比GraFlex生成的寄存器传输级（RTL）加速器，综合后的单位性能逻辑资源使用量降低',
            highlight('20%')
          ),
        ],
      },
      {
        title: '中期完成情况',
        items: [
          line(
            '2.1 相比GraFlex生成的寄存器传输级（RTL）加速器，综合后的单位性能逻辑资源使用量降低',
            highlight('43.06%')
          ),
        ],
      },
      commonSections.method,
    ],
    algorithms: [
      {
        key: 'adaptive-deploy-tool',
        label: '多维指标敏感的加速器自适应优化和部署工具',
        category: '子课题二',
        description:
          '展示面向性能、逻辑资源和部署约束的自适应优化流程，并与GraFlex生成的RTL加速器进行单位性能资源效率对比。',
        midtermTarget: '单位性能逻辑资源使用量降低 20%',
        evaluation: '在典型图算法部署场景下统计综合后设计相对GraFlex RTL基线的资源效率提升。',
        datasets: [
          {
            key: 'pagerank-opt',
            label: 'PageRank 优化场景',
            nodes: '1,048,576',
            edges: '16,777,216',
            source: '动态图算法部署样例',
            description: '用于展示遍历类算法在多维指标约束下的自适应优化效果。',
          },
          {
            key: 'graph-mining-opt',
            label: '图挖掘优化场景',
            nodes: '524,288',
            edges: '8,388,608',
            source: '图挖掘部署样例',
            description: '用于展示结构密集型任务下单位性能逻辑资源使用量的下降情况。',
          },
          { key: ALL_DATASETS_KEY, label: '全部验证场景' },
        ],
      },
    ],
    tableTitle: '自适应优化和部署工具验收结果',
    tableColumns: [
      { key: 'algorithm', label: '子课题' },
      { key: 'dataset', label: '验证场景' },
      { key: 'resourceReductionTarget', label: '目标降低比例(%)', align: 'right' },
      { key: 'resourceReduction', label: '完成降低比例(%)', align: 'right' },
      { key: 'completionRate', label: '达成率(%)', align: 'right' },
      { key: 'status', label: '状态' },
    ],
    chart: {
      title: '指标2.1 单位性能逻辑资源使用量降低情况',
      metrics: [
        {
          key: 'resourceReduction',
          label: '资源降低比例',
          unit: '%',
          valueKey: 'resourceReduction',
          targetKey: 'resourceReductionTarget',
          defaultTarget: 20,
        },
      ],
    },
  },

  part3: {
    apiBasePath: '/midterm/part3',
    allDatasetsKey: ALL_DATASETS_KEY,
    introSections: [
      {
        title: '中期考核指标',
        items: [
          line('指标3.1：图算法执行平均性能达到', highlight('5GTEPS')),
          line('指标3.2：动态图更新吞吐率可达每秒', highlight('亿级边')),
        ],
      },
      {
        title: '中期完成情况',
        items: [
          line('3.1 图算法执行平均性能达到', highlight('3.34GTEPS')),
          line('3.2 动态图更新吞吐率可达每秒', highlight('1.95亿条边')),
        ],
      },
      commonSections.method,
    ],
    algorithms: [
      {
        key: 'heterogeneous-runtime',
        label: '面向动态图计算的异构运行时',
        category: '子课题三',
        description:
          '展示动态图计算任务在异构运行时中的调度、更新和执行能力，重点体现图算法执行性能与动态图更新吞吐率。',
        midtermTarget: '图算法执行平均性能达到 5GTEPS，动态图更新吞吐率达到每秒亿级边',
        evaluation: '在动态图执行与更新混合场景下统计GTEPS和每秒亿边更新吞吐率。',
        datasets: [
          {
            key: 'stream-update',
            label: '流式动态图更新场景',
            nodes: '3,200,000',
            edges: '120,000,000',
            source: '动态图流式更新样例',
            description: '用于验证运行时处理连续边更新时的吞吐能力。',
          },
          {
            key: 'mixed-execution',
            label: '计算更新混合场景',
            nodes: '1,800,000',
            edges: '64,000,000',
            source: '动态图计算更新混合样例',
            description: '用于验证运行时在图算法执行与动态图更新交织情况下的综合性能。',
          },
          { key: ALL_DATASETS_KEY, label: '全部验证场景' },
        ],
      },
    ],
    tableTitle: '异构运行时验收结果',
    tableColumns: [
      { key: 'algorithm', label: '子课题' },
      { key: 'dataset', label: '验证场景' },
      { key: 'performanceTarget', label: '目标执行性能(GTEPS)', align: 'right' },
      { key: 'performance', label: '完成执行性能(GTEPS)', align: 'right' },
      { key: 'updateThroughputTarget', label: '目标更新吞吐(亿边/秒)', align: 'right' },
      { key: 'updateThroughput', label: '完成更新吞吐(亿边/秒)', align: 'right' },
      { key: 'status', label: '状态' },
    ],
    chart: {
      title: '指标3.1/3.2 运行时指标达成情况',
      metrics: [
        {
          key: 'performance',
          label: '执行性能',
          unit: 'GTEPS',
          valueKey: 'performance',
          targetKey: 'performanceTarget',
          defaultTarget: 5,
        },
        {
          key: 'updateThroughput',
          label: '更新吞吐',
          unit: '亿边/秒',
          valueKey: 'updateThroughput',
          targetKey: 'updateThroughputTarget',
          defaultTarget: 1,
        },
      ],
    },
  },

  part4: {
    apiBasePath: '/midterm/part4',
    allDatasetsKey: ALL_DATASETS_KEY,
    introSections: [
      {
        title: '中期考核指标',
        items: [
          line(
            '指标4.1：相比典型寄存器传输级（RTL）图计算加速器（HitGraph），基于高层次综合系统设计的图计算代码密度压缩',
            highlight('10倍')
          ),
          line(
            '指标4.2：针对',
            highlight('电表数据'),
            '在电力领域的应用场景，采用动态图计算技术，基于电表数据构建图模型，实现',
            highlight('电力潮流分析'),
            '和',
            highlight('电网状态监测'),
            '，确保高效稳定的省侧级电力潮流分析计算以及省级区域内',
            highlight('负荷优化响应'),
            '；同时提供面向图应用的高效易用',
            highlight('开发工具链'),
            '，基于工具链开发面向电力领域的典型应用'
          ),
        ],
      },
      {
        title: '中期完成情况',
        items: [
          line(
            '4.1 相比典型寄存器传输级（RTL）图计算加速器（HitGraph），基于高层次综合系统设计的图计算代码密度压缩',
            highlight('6.45倍')
          ),
        ],
      },
      commonSections.method,
    ],
    algorithms: [
      {
        key: 'programming-abstraction',
        label: '面向动态图计算的高层编程抽象与应用验证',
        category: '子课题四',
        description: '展示高层编程抽象对动态图计算应用开发效率的提升，以及面向电力领域电表数据的动态图应用验证。',
        midtermTarget: '代码密度压缩 10倍，并完成电力领域动态图应用验证',
        evaluation: '与HitGraph RTL设计进行代码密度对比，同时展示电表数据图模型、潮流分析和状态监测应用验证流程。',
        datasets: [
          {
            key: 'hitgraph-case-a',
            label: 'HitGraph 对比场景A',
            nodes: '220,000',
            edges: '1,860,000',
            source: 'RTL对比样例',
            description: '用于验证高层编程抽象相对典型RTL图计算加速器的代码密度压缩效果。',
          },
          {
            key: 'meter-power-flow',
            label: '电表数据应用场景',
            nodes: '1,200,000',
            edges: '5,600,000',
            source: '电力领域电表数据样例',
            description: '用于展示基于电表数据构建图模型后的电力潮流分析、电网状态监测和负荷优化响应应用。',
          },
          { key: ALL_DATASETS_KEY, label: '全部验证场景' },
        ],
      },
    ],
    tableTitle: '高层编程抽象与应用验证结果',
    tableColumns: [
      { key: 'algorithm', label: '子课题' },
      { key: 'dataset', label: '验证场景' },
      { key: 'codeDensityTarget', label: '目标代码密度压缩(倍)', align: 'right' },
      { key: 'codeDensity', label: '完成代码密度压缩(倍)', align: 'right' },
      { key: 'completionRate', label: '达成率(%)', align: 'right' },
      { key: 'applicationScenario', label: '应用验证内容' },
      { key: 'status', label: '状态' },
    ],
    chart: {
      title: '指标4.1 代码密度压缩达成情况',
      metrics: [
        {
          key: 'codeDensity',
          label: '代码密度压缩',
          unit: '倍',
          valueKey: 'codeDensity',
          targetKey: 'codeDensityTarget',
          defaultTarget: 10,
        },
      ],
    },
  },
};
