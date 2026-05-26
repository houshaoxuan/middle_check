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
  label: 'Graph1',
  nodes: '17.1M',
  edges: '1046.9M',
  source: 'PPT 图数据集规模与实验结果',
  description: '用于验证高性能动态图计算加速器架构，PageRank/BFS/CC 的性能分别为 29.50、30.56、31.33 GTEPS。',
};

const acceleratorGraph2 = {
  key: 'graph2',
  label: 'Graph2',
  nodes: '16.8M',
  edges: '503.3M',
  source: 'PPT 图数据集规模与实验结果',
  description: '用于验证高性能动态图计算加速器架构，PageRank/BFS/CC 的性能分别为 24.79、27.78、29.28 GTEPS。',
};

const deploymentDefaultDataset = {
  key: 'default',
  label: 'GraFlex/DFGraph 对比实验',
  nodes: '-',
  edges: '-',
  source: 'PPT 单位性能逻辑资源使用量对比',
  description: '该页面不需要选择数据集，默认使用 GraFlex 与 DFGraph 在 PageRank、BFS、CC 上的 CLB/MTEPS 对比结果。',
};

const updateGraph1 = {
  key: 'graph1',
  label: 'Graph1',
  nodes: '268.4M',
  edges: '16.1B',
  updateScale: '0.1%-1%',
  source: 'PPT 动态图差分数据存储技术实验结果',
  description: '图更新规模为 0.1%-1%，图更新吞吐率为 1.91 亿边/秒。',
};

const updateGraph2 = {
  key: 'graph2',
  label: 'Graph2',
  nodes: '536.9M',
  edges: '4.4B',
  updateScale: '0.1%-1%',
  source: 'PPT 动态图差分数据存储技术实验结果',
  description: '图更新规模为 0.1%-1%，图更新吞吐率为 2.18 亿边/秒。',
};

const algorithmGraph1 = {
  key: 'graph1',
  label: 'Graph1',
  nodes: '268.4M',
  edges: '16.1B',
  source: 'PPT 图算法性能实验结果',
  description: '固定用于图算法性能展示，PageRank/BFS/CC 的性能分别为 3.61、3.15、3.27 GTEPS。',
};

const abstractionDefaultDataset = {
  key: 'default',
  label: 'HitGraph 代码密度对比实验',
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
  return [
    { title: '考核指标', items: assessment },
    { title: '中期指标', items: midterm },
    { title: '中期完成情况', items: completion },
    { title: '考核方式', items: method },
    { title: '数据集来源', items: source },
  ];
}

const pagerankHitGraphCode = `module HitGraphPageRank(
  input  wire        clk,
  input  wire        rst_n,
  input  wire [31:0] row_ptr_base,
  input  wire [31:0] col_idx_base,
  input  wire [31:0] rank_base,
  input  wire [31:0] out_degree_base,
  output wire        done
);
  localparam LOAD_ROW      = 4'd0;
  localparam LOAD_EDGE     = 4'd1;
  localparam READ_RANK     = 4'd2;
  localparam READ_DEGREE   = 4'd3;
  localparam SCATTER_MSG   = 4'd4;
  localparam REDUCE_MSG    = 4'd5;
  localparam APPLY_DAMPING = 4'd6;
  localparam WRITE_RANK    = 4'd7;
  localparam NEXT_VERTEX   = 4'd8;
  localparam CHECK_DONE    = 4'd9;
  reg [3:0] state;
  reg [31:0] src;
  reg [31:0] dst;
  reg [31:0] edge_offset;
  reg [31:0] msg_buffer;
  reg [31:0] accum_buffer;
  always @(posedge clk) begin
    if (!rst_n) begin
      state <= LOAD_ROW;
      src <= 0;
      dst <= 0;
      edge_offset <= 0;
    end else begin
      case (state)
        LOAD_ROW:      state <= LOAD_EDGE;
        LOAD_EDGE:     state <= READ_RANK;
        READ_RANK:     state <= READ_DEGREE;
        READ_DEGREE:   state <= SCATTER_MSG;
        SCATTER_MSG:   state <= REDUCE_MSG;
        REDUCE_MSG:    state <= APPLY_DAMPING;
        APPLY_DAMPING: state <= WRITE_RANK;
        WRITE_RANK:    state <= NEXT_VERTEX;
        NEXT_VERTEX:   state <= CHECK_DONE;
        CHECK_DONE:    state <= LOAD_ROW;
        default:       state <= LOAD_ROW;
      endcase
    end
  end
endmodule`;

const pagerankDfCode = `graph_app PageRank(Graph g, Property rank) {
  const fixed damping = 0.85;
  frontier active = g.vertices();

  initialize(rank, 1.0 / g.vertex_count());

  iterate until converged {
    message contrib = scatter(active, g.out_edges) {
      return rank[src] / out_degree(src);
    };

    rank = apply(rank, reduce_sum(contrib)) {
      return (1.0 - damping) + damping * value;
    };

    active = changed(rank);
  }

  emit rank;
}`;

const bfsHitGraphCode = `module HitGraphBFS(
  input  wire        clk,
  input  wire        rst_n,
  input  wire [31:0] frontier_base,
  input  wire [31:0] row_ptr_base,
  input  wire [31:0] col_idx_base,
  output wire        done
);
  localparam READ_FRONTIER = 4'd0;
  localparam CHECK_ACTIVE  = 4'd1;
  localparam LOAD_ROW      = 4'd2;
  localparam SCAN_EDGE     = 4'd3;
  localparam TEST_VISITED  = 4'd4;
  localparam WRITE_LEVEL   = 4'd5;
  localparam PUSH_NEXT     = 4'd6;
  localparam UPDATE_QUEUE  = 4'd7;
  localparam NEXT_VERTEX   = 4'd8;
  localparam FINISH_LEVEL  = 4'd9;
  reg [3:0] state;
  reg [31:0] vertex_id;
  reg [31:0] neighbor_id;
  reg [31:0] level_value;
  always @(posedge clk) begin
    if (!rst_n) begin
      state <= READ_FRONTIER;
      vertex_id <= 0;
      neighbor_id <= 0;
      level_value <= 0;
    end else begin
      case (state)
        READ_FRONTIER: state <= CHECK_ACTIVE;
        CHECK_ACTIVE:  state <= LOAD_ROW;
        LOAD_ROW:      state <= SCAN_EDGE;
        SCAN_EDGE:     state <= TEST_VISITED;
        TEST_VISITED:  state <= WRITE_LEVEL;
        WRITE_LEVEL:   state <= PUSH_NEXT;
        PUSH_NEXT:     state <= UPDATE_QUEUE;
        UPDATE_QUEUE:  state <= NEXT_VERTEX;
        NEXT_VERTEX:   state <= FINISH_LEVEL;
        FINISH_LEVEL:  state <= READ_FRONTIER;
        default:       state <= READ_FRONTIER;
      endcase
    end
  end
endmodule`;

const bfsDfCode = `graph_app BFS(Graph g, Vertex root, Property level) {
  frontier current = frontier_of(root);
  initialize(level, INF);
  level[root] = 0;

  while current.not_empty() {
    frontier next = scatter(current, g.out_edges) {
      if (level[dst] == INF) {
        return dst;
      }
    };

    apply(next) {
      level[vertex] = level[src] + 1;
    };

    current = unique(next);
  }

  emit level;
}`;

const ccHitGraphCode = `module HitGraphCC(
  input  wire        clk,
  input  wire        rst_n,
  input  wire [31:0] row_ptr_base,
  input  wire [31:0] col_idx_base,
  input  wire [31:0] comp_base,
  output wire        done
);
  localparam INIT_COMP       = 4'd0;
  localparam LOAD_VERTEX     = 4'd1;
  localparam LOAD_EDGE_RANGE = 4'd2;
  localparam READ_NEIGHBOR   = 4'd3;
  localparam READ_COMP       = 4'd4;
  localparam MIN_REDUCE      = 4'd5;
  localparam WRITE_COMP      = 4'd6;
  localparam SET_CHANGED     = 4'd7;
  localparam NEXT_EDGE       = 4'd8;
  localparam NEXT_ROUND      = 4'd9;
  reg [3:0] state;
  reg [31:0] vertex_id;
  reg [31:0] min_component;
  reg        changed;
  always @(posedge clk) begin
    if (!rst_n) begin
      state <= INIT_COMP;
      changed <= 1'b0;
      vertex_id <= 0;
      min_component <= 0;
    end else begin
      case (state)
        INIT_COMP:       state <= LOAD_VERTEX;
        LOAD_VERTEX:     state <= LOAD_EDGE_RANGE;
        LOAD_EDGE_RANGE: state <= READ_NEIGHBOR;
        READ_NEIGHBOR:   state <= READ_COMP;
        READ_COMP:       state <= MIN_REDUCE;
        MIN_REDUCE:      state <= WRITE_COMP;
        WRITE_COMP:      state <= SET_CHANGED;
        SET_CHANGED:     state <= NEXT_EDGE;
        NEXT_EDGE:       state <= NEXT_ROUND;
        NEXT_ROUND:      state <= LOAD_VERTEX;
        default:         state <= INIT_COMP;
      endcase
    end
  end
endmodule`;

const ccDfCode = `graph_app ConnectedComponents(Graph g, Property comp) {
  initialize(comp, vertex_id());
  frontier active = g.vertices();

  iterate while changed(comp) {
    message candidate = scatter(active, g.edges) {
      return min(comp[src], comp[dst]);
    };

    comp = apply(comp, reduce_min(candidate)) {
      return min(old_value, value);
    };

    active = vertices_changed(comp);
  }

  emit comp;
}`;

export const midtermProjectConfigs = {
  part2: {
    apiBasePath: '/midterm/part2',
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
      source: ['Graph1：顶点数 17.1M，边数 1046.9M。', 'Graph2：顶点数 16.8M，边数 503.3M。'],
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
      { key: 'performance', label: '中期完成情况（GTEPS）', align: 'right' },
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

  part3: {
    apiBasePath: '/midterm/part3',
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
        line('相比GraFlex生成的寄存器传输级（RTL）加速器，综合后的单位性能逻辑资源使用量降低', highlight('43.06%')),
        '完成中期指标值且达到考核指标，通过第三方测试。',
      ],
      method: [
        '在 Xilinx Alveo U55C FPGA 板卡上使用所提出方法综合和部署动态图计算加速器（DFGraph），对比 GraFlex 与 DFGraph 的单位性能逻辑资源使用量（CLB/MTEPS）。',
        ...platformItems,
      ],
      source: [
        'GraFlex 基线 CLB/MTEPS：PageRank 7.15，BFS 3.75，CC 3.98。',
        'DFGraph 综合后 CLB/MTEPS：PageRank 3.51，BFS 2.36，CC 2.34。',
      ],
    }),
    controls: {
      showDatasetSelect: false,
      algorithmLabel: '选择算法',
    },
    algorithms: graphAlgorithms([deploymentDefaultDataset]),
    tableTitle: '资源占用对比结果汇总',
    tableColumns: [
      { key: 'algorithm', label: '算法' },
      { key: 'graflexClbPerMteps', label: 'GraFlex 资源占用（CLB/MTEPS）', align: 'right' },
      { key: 'dfgraphClbPerMteps', label: 'DFGraph 资源占用（CLB/MTEPS）', align: 'right' },
      { key: 'resourceReductionTarget', label: '资源使用量降低中期指标（%）', align: 'right' },
      { key: 'resourceReduction', label: '中期完成情况（%）', align: 'right' },
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

  part4Update: {
    apiBasePath: '/midterm/part4-update',
    allDatasetsKey: 'all',
    introSections: sections({
      assessment: [line('指标3.2：动态图更新吞吐率可达每秒', highlight('亿级边'))],
      midterm: [line('指标3.2：动态图更新吞吐率可达', highlight('每秒千万级边'))],
      completion: [line('动态图更新吞吐率可达每秒', highlight('1.95亿条边'))],
      method: ['在 CPU-FPGA 异构架构上实现所提出的异构运行时方法，执行动态图更新吞吐测试。', ...platformItems],
      source: [
        'Graph1：顶点数 268.4M，边数 16.1B，图更新规模 0.1%-1%，吞吐 1.91 亿边/秒。',
        'Graph2：顶点数 536.9M，边数 4.4B，图更新规模 0.1%-1%，吞吐 2.18 亿边/秒。',
      ],
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
        evaluation: '选择 Graph1 或 Graph2 后运行，统计动态图边更新吞吐率。',
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
      { key: 'updateThroughput', label: '中期完成情况（亿边/秒）', align: 'right' },
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

  part4Algorithm: {
    apiBasePath: '/midterm/part4-algorithm',
    allDatasetsKey: 'all',
    introSections: sections({
      assessment: [line('指标3.1：图算法执行平均性能达到', highlight('5GTEPS'))],
      midterm: [line('指标3.1：图算法执行平均性能达到', highlight('3GTEPS'))],
      completion: [line('图算法执行平均性能达到', highlight('3.34GTEPS'))],
      method: [
        '在 CPU-FPGA 异构架构上实现所提出的异构运行时方法，固定 Graph1 运行 PageRank、BFS、CC 并统计 GTEPS。',
        ...platformItems,
      ],
      source: [
        'Graph1：顶点数 268.4M，边数 16.1B。',
        'Graph1 上 PageRank/BFS/CC 的性能分别为 3.61、3.15、3.27 GTEPS。',
      ],
    }),
    controls: {
      algorithmLabel: '选择算法',
      datasetLabel: '固定数据集',
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
      { key: 'performance', label: '中期完成情况（GTEPS）', align: 'right' },
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

  part5: {
    apiBasePath: '/midterm/part5',
    allDatasetsKey: 'all',
    introSections: sections({
      assessment: [
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
      midterm: [
        line(
          '指标4.1：相比典型寄存器传输级（RTL）图计算加速器（HitGraph），基于高层次综合系统设计的图计算代码密度压缩',
          highlight('5倍')
        ),
      ],
      completion: [
        line(
          '相比典型寄存器传输级（RTL）图计算加速器（HitGraph），基于高层次综合系统设计的图计算代码密度压缩',
          highlight('6.45倍')
        ),
        '完成中期指标值，通过第三方测试。',
      ],
      method: [
        '利用高层次综合优势提供用户可编程接口，用户只需要编写少量 C++ 风格代码即可实现自定义算法。',
        '对比 HitGraph 的编程抽象与本课题中设计的编程抽象，并统计有效代码密度（行数）。',
      ],
      source: [
        'PPT 有效代码密度（行数）对比：包含 BFS、PageRank、CC 三类算法。',
        '代码对比展示中的示例代码为本地模拟展示数据，用于体现 HitGraph 与本课题编程抽象的表达差异。',
      ],
    }),
    controls: {
      showDatasetSelect: false,
      algorithmLabel: '选择算法',
    },
    algorithms: graphAlgorithms([abstractionDefaultDataset]),
    codeComparison: {
      title: '代码对比展示',
      byAlgorithm: {
        pagerank: [
          { title: 'HitGraph的编程抽象', code: pagerankHitGraphCode },
          { title: '本课题中设计的编程抽象', code: pagerankDfCode },
        ],
        bfs: [
          { title: 'HitGraph的编程抽象', code: bfsHitGraphCode },
          { title: '本课题中设计的编程抽象', code: bfsDfCode },
        ],
        cc: [
          { title: 'HitGraph的编程抽象', code: ccHitGraphCode },
          { title: '本课题中设计的编程抽象', code: ccDfCode },
        ],
      },
    },
    tableTitle: '编程抽象代码密度结果汇总',
    tableColumns: [
      { key: 'algorithm', label: '算法' },
      { key: 'hitgraphCodeLines', label: 'HitGraph 效果（行）', align: 'right' },
      { key: 'dfgraphCodeLines', label: '本课题效果（行）', align: 'right' },
      { key: 'codeDensityTarget', label: '中期指标（压缩x倍）', align: 'right' },
      { key: 'codeDensity', label: '中期完成情况（压缩x倍）', align: 'right' },
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
