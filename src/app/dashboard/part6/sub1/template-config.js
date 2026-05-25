export const midtermTemplateConfig = {
  allDatasetsKey: 'all',
  introSections: [
    {
      title: '考核指标',
      items: [
        '指标T.1：展示项目核心算法或核心模块的执行性能',
        '指标T.2：展示中期目标值与实测值对比',
        '指标T.3：展示运行日志、数据集规模和测试结果表格',
      ],
    },
    {
      title: '中期指标',
      items: [
        {
          parts: [
            { text: '算法A在标准数据集上的性能达到 ' },
            { text: '100 ops/s', highlight: true },
          ],
        },
        {
          parts: [
            { text: '算法B在标准数据集上的性能达到 ' },
            { text: '50 ops/s', highlight: true },
          ],
        },
        {
          parts: [
            { text: '端到端处理时延低于 ' },
            { text: '20 ms', highlight: true },
          ],
        },
      ],
    },
    {
      title: '考核方式',
      items: [
        '选择算法与数据集后点击运行，展示模拟执行日志、结果表格和柱状图',
        '后续项目只需要替换本配置文件中的指标、数据集、结果和日志内容',
      ],
    },
  ],
  algorithms: [
    {
      key: 'algorithm-a',
      label: '算法A',
      category: '核心性能算法',
      description: '算法A用于展示项目核心计算流程的端到端执行能力，适合替换为具体项目中的主算法、主模型或主处理链路。',
      midtermTarget: '性能达到 100 ops/s，平均时延低于 20 ms',
      evaluation: '固定数据集重复运行 3 次，取平均性能与平均时延',
      datasets: [
        {
          key: 'demo-small',
          label: 'Demo-Small',
          nodes: '65,536',
          edges: '1,048,576',
          source: '项目自建测试集',
          description: '小规模功能验证数据集，用于快速确认算法流程、日志展示和指标计算是否正常。',
        },
        {
          key: 'demo-medium',
          label: 'Demo-Medium',
          nodes: '262,144',
          edges: '4,194,304',
          source: '项目自建测试集',
          description: '中等规模性能验证数据集，用于展示中期性能指标达成情况。',
        },
        { key: 'all', label: '全部数据集' },
      ],
    },
    {
      key: 'algorithm-b',
      label: '算法B',
      category: '对比验证算法',
      description: '算法B用于展示另一个典型任务或对比任务的中期指标，可替换为图遍历、图挖掘、图学习或领域应用算法。',
      midtermTarget: '性能达到 50 ops/s，平均时延低于 20 ms',
      evaluation: '固定数据集重复运行 3 次，取平均性能与平均时延',
      datasets: [
        {
          key: 'case-1',
          label: 'Case-1',
          nodes: '120,000',
          edges: '2,200,000',
          source: '公开样例数据',
          description: '用于展示算法B在常规规模输入下的稳定性和指标达成情况。',
        },
        {
          key: 'case-2',
          label: 'Case-2',
          nodes: '380,000',
          edges: '6,400,000',
          source: '公开样例数据',
          description: '用于展示算法B在较大规模输入下的执行性能和时延情况。',
        },
        { key: 'all', label: '全部数据集' },
      ],
    },
  ],
  tableTitle: '通用中期检查结果',
  tableColumns: [
    { key: 'algorithm', label: '算法' },
    { key: 'dataset', label: '数据集' },
    { key: 'nodes', label: '点规模', align: 'right' },
    { key: 'edges', label: '边规模', align: 'right' },
    { key: 'latency', label: '平均时延(ms)', align: 'right' },
    { key: 'performance', label: '性能(ops/s)', align: 'right' },
    { key: 'performanceTarget', label: '中期性能指标', align: 'right' },
    { key: 'speedup', label: '加速比', align: 'right' },
  ],
  chart: {
    title: '中期指标达成情况',
    metrics: [
      {
        key: 'performance',
        label: '性能',
        unit: 'ops/s',
        valueKey: 'performance',
        targetKey: 'performanceTarget',
        defaultTarget: 100,
      },
      {
        key: 'latency',
        label: '平均时延',
        unit: 'ms',
        valueKey: 'latency',
        targetKey: 'latencyTarget',
        defaultTarget: 20,
      },
    ],
  },
};
