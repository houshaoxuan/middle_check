"use client";

import { useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

// 自定义分组节点组件
const GroupNode = ({ data }) => {
  const borderColor = data.color || '#3B82F6';
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'transparent',
      border: `2px dashed ${borderColor}`,
      borderRadius: '8px',
      padding: '20px 10px 10px 10px',
      boxSizing: 'border-box',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'transparent',
        padding: '0 10px',
        fontWeight: 'bold',
        fontSize: '14px',
        color: borderColor,
      }}>
        {data.label}
      </div>
    </div>
  );
};

// 流程图模块数据
const modules = [
  { id: '1', name: '运客数据', description: '运客数据模块负责收集和管理运输相关的客户数据，包括乘客信息、行程记录等。' },
  { id: '2', name: '数据清洗', description: '数据清洗模块对原始数据进行预处理，去除噪声、填补缺失值，确保数据质量。' },
  { id: '3', name: '简单客户', description: '简单客户模块存储基本客户信息，用于快速访问和查询。' },
  { id: '4', name: '子客划分', description: '子客划分模块根据特定规则将客户群体进行细分，便于后续分析。' },
  { id: '5', name: '子客', description: '子客模块管理细分后的客户群体，提供详细的子客信息和特征。' },
  { id: '6', name: '计算节点', description: '计算节点模块负责执行数据处理和计算任务，是系统的核心计算单元。' },
  { id: '7', name: '输出', description: '输出模块将处理后的数据以合适的形式输出，供其他系统或用户使用。' },
  { id: '8', name: '结果聚类', description: '结果聚类模块对计算结果进行聚类分析，识别数据中的模式和趋势。' },
  { id: '9', name: '原始数据型及编码器群', description: '此模块负责管理原始数据的类型定义及编码器群，用于数据标准化。' },
  { id: '10', name: '算法', description: '算法模块包含多种数据处理和分析算法，用于支持计算任务。' },
  { id: '11', name: '本地子客计算', description: '本地子客计算模块在本地环境中对子客数据进行计算和分析。' },
  { id: '12', name: '基于规则的运计算加速度卡', description: '此模块基于规则加速运输计算，提升系统性能。' },
  { id: '13', name: '运计算的加速度卡', description: '运计算的加速度卡模块进一步优化计算速度，减少延迟。' },
];

// 流程图节点（包括分组节点）
const initialNodes = [
  // 分组节点 1
  {
    id: 'group-1',
    type: 'group',
    data: { label: '模块 1', color: '#3B82F6' },
    position: { x: 30, y: 30 },
    style: {
      width: 150,
      height: 300,
      background: 'transparent',
    },
  },
  { id: '1', parentNode: 'group-1', data: { label: '运客数据' }, position: { x: 20, y: 40 }, style: { background: '#3B82F6', color: 'white', padding: '10px', borderRadius: '8px' } },
  { id: '2', parentNode: 'group-1', data: { label: '数据清洗' }, position: { x: 20, y: 120 }, style: { background: '#3B82F6', color: 'white', padding: '10px', borderRadius: '8px' } },
  { id: '3', parentNode: 'group-1', data: { label: '简单客户' }, position: { x: 20, y: 200 }, style: { background: '#3B82F6', color: 'white', padding: '10px', borderRadius: '8px' } },

  // 分组节点 2
  {
    id: 'group-2',
    type: 'group',
    data: { label: '模块 2', color: '#3B82F6' },
    position: { x: 280, y: 30 },
    style: {
      width: 150,
      height: 300,
      background: 'transparent',
    },
  },
  { id: '4', parentNode: 'group-2', data: { label: '子客划分' }, position: { x: 20, y: 40 }, style: { background: '#3B82F6', color: 'white', padding: '10px', borderRadius: '8px' } },
  { id: '5', parentNode: 'group-2', data: { label: '子客' }, position: { x: 20, y: 120 }, style: { background: '#3B82F6', color: 'white', padding: '10px', borderRadius: '8px' } },
  { id: '6', parentNode: 'group-2', data: { label: '计算节点' }, position: { x: 20, y: 200 }, style: { background: '#3B82F6', color: 'white', padding: '10px', borderRadius: '8px' } },

  // 单独节点
  { id: '7', data: { label: '输出' }, position: { x: 530, y: 150 }, style: { background: '#FBBF24', color: 'black', padding: '10px', borderRadius: '8px' } },

  // 分组节点 3
  {
    id: 'group-3',
    type: 'group',
    data: { label: '模块 3', color: '#10B981' },
    position: { x: 30, y: 380 },
    style: {
      width: 550,
      height: 150,
      background: 'transparent',
    },
  },
  { id: '8', parentNode: 'group-3', data: { label: '结果聚类' }, position: { x: 20, y: 40 }, style: { background: '#10B981', color: 'white', padding: '10px', borderRadius: '8px' } },
  { id: '9', parentNode: 'group-3', data: { label: '原始数据型及编码器群' }, position: { x: 150, y: 40 }, style: { background: '#10B981', color: 'white', padding: '10px', borderRadius: '8px' } },
  { id: '10', parentNode: 'group-3', data: { label: '算法' }, position: { x: 300, y: 40 }, style: { background: '#10B981', color: 'white', padding: '10px', borderRadius: '8px' } },
  { id: '11', parentNode: 'group-3', data: { label: '本地子客计算' }, position: { x: 450, y: 40 }, style: { background: '#10B981', color: 'white', padding: '10px', borderRadius: '8px' } },

  // 分组节点 4
  {
    id: 'group-4',
    type: 'group',
    data: { label: '模块 4', color: '#6B7280' },
    position: { x: 180, y: 560 },
    style: {
      width: 300,
      height: 100,
      background: 'transparent',
    },
  },
  { id: '12', parentNode: 'group-4', data: { label: '基于规则的运计算加速度卡' }, position: { x: 20, y: 40 }, style: { background: '#6B7280', color: 'white', padding: '10px', borderRadius: '8px' } },
  { id: '13', parentNode: 'group-4', data: { label: '运计算的加速度卡' }, position: { x: 220, y: 40 }, style: { background: '#6B7280', color: 'white', padding: '10px', borderRadius: '8px' } },
];

// 流程图边（箭头）
const initialEdges = [
  { id: 'e1-4', source: '1', target: '4', animated: true, style: { stroke: '#3B82F6' }, label: '数据流', labelStyle: { fill: '#3B82F6', fontSize: '12px' }, labelBgStyle: { fill: '#fff', fillOpacity: 0.8 }, labelBgPadding: [4, 2], markerEnd: 'url(#arrow-blue)' },
  { id: 'e2-5', source: '2', target: '5', animated: true, style: { stroke: '#3B82F6' }, label: '清洗后数据', labelStyle: { fill: '#3B82F6', fontSize: '12px' }, labelBgStyle: { fill: '#fff', fillOpacity: 0.8 }, labelBgPadding: [4, 2], markerEnd: 'url(#arrow-blue)' },
  { id: 'e3-6', source: '3', target: '6', animated: true, style: { stroke: '#3B82F6' }, label: '客户信息', labelStyle: { fill: '#3B82F6', fontSize: '12px' }, labelBgStyle: { fill: '#fff', fillOpacity: 0.8 }, labelBgPadding: [4, 2], markerEnd: 'url(#arrow-blue)' },
  { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#3B82F6' }, label: '划分结果', labelStyle: { fill: '#3B82F6', fontSize: '12px' }, labelBgStyle: { fill: '#fff', fillOpacity: 0.8 }, labelBgPadding: [4, 2], markerEnd: 'url(#arrow-blue)' },
  { id: 'e5-6', source: '5', target: '6', animated: true, style: { stroke: '#3B82F6' }, label: '双向计算', labelStyle: { fill: '#3B82F6', fontSize: '12px' }, labelBgStyle: { fill: '#fff', fillOpacity: 0.8 }, labelBgPadding: [4, 2], markerStart: 'url(#arrow-blue)', markerEnd: 'url(#arrow-blue)' },
  { id: 'e5-7', source: '5', target: '7', animated: true, style: { stroke: '#FBBF24' }, label: '最终输出', labelStyle: { fill: '#FBBF24', fontSize: '12px' }, labelBgStyle: { fill: '#fff', fillOpacity: 0.8 }, labelBgPadding: [4, 2], markerEnd: 'url(#arrow-yellow)' },
  { id: 'e6-11', source: '6', target: '11', animated: true, style: { stroke: '#10B981' }, label: '计算结果', labelStyle: { fill: '#10B981', fontSize: '12px' }, labelBgStyle: { fill: '#fff', fillOpacity: 0.8 }, labelBgPadding: [4, 2], markerEnd: 'url(#arrow-green)' },
  { id: 'e8-9', source: '8', target: '9', animated: true, style: { stroke: '#10B981' }, label: '聚类数据', labelStyle: { fill: '#10B981', fontSize: '12px' }, labelBgStyle: { fill: '#fff', fillOpacity: 0.8 }, labelBgPadding: [4, 2], markerEnd: 'url(#arrow-green)' },
  { id: 'e9-10', source: '9', target: '10', animated: true, style: { stroke: '#10B981' }, label: '数据编码', labelStyle: { fill: '#10B981', fontSize: '12px' }, labelBgStyle: { fill: '#fff', fillOpacity: 0.8 }, labelBgPadding: [4, 2], markerEnd: 'url(#arrow-green)' },
  { id: 'e10-11', source: '10', target: '11', animated: true, style: { stroke: '#10B981' }, label: '算法交互', labelStyle: { fill: '#10B981', fontSize: '12px' }, labelBgStyle: { fill: '#fff', fillOpacity: 0.8 }, labelBgPadding: [4, 2], markerStart: 'url(#arrow-green)', markerEnd: 'url(#arrow-green)' },
  { id: 'e11-12', source: '11', target: '12', animated: true, style: { stroke: '#6B7280' }, label: '加速规则', labelStyle: { fill: '#6B7280', fontSize: '12px' }, labelBgStyle: { fill: '#fff', fillOpacity: 0.8 }, labelBgPadding: [4, 2], markerEnd: 'url(#arrow-gray)' },
  { id: 'e11-13', source: '11', target: '13', animated: true, style: { stroke: '#6B7280' }, label: '加速优化', labelStyle: { fill: '#6B7280', fontSize: '12px' }, labelBgStyle: { fill: '#fff', fillOpacity: '0.8' }, labelBgPadding: [4, 2], markerEnd: 'url(#arrow-gray)' },
];

// 定义箭头标记（按颜色区分）
const arrowHeads = (
  <defs>
    <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6" />
    </marker>
    <marker id="arrow-yellow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#FBBF24" />
    </marker>
    <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#10B981" />
    </marker>
    <marker id="arrow-gray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#6B7280" />
    </marker>
  </defs>
);

export default function FlowChartPage() {
  const [selectedModule, setSelectedModule] = useState(null);

  const onNodeClick = useCallback((event, node) => {
    if (node.type === 'group') return;
    const module = modules.find(m => m.id === node.id);
    setSelectedModule(module);
    document.getElementById('module-details').scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
          .container {
            min-height: 100vh;
            background-color: #1F2937;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
          }
          .wrapper {
            width: 100%;
            max-width: 1200px;
          }
          .title {
            font-size: 2rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 2rem;
          }
          .flowchart-container {
            width: 100%;
            height: 700px;
            background-color: #374151;
            border-radius: 8px;
            margin-bottom: 2rem;
            overflow: hidden;
          }
          .module-details {
            background-color: #374151;
            padding: 1.5rem;
            border-radius: 8px;
          }
          .module-details h2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }
          .module-details p {
            font-size: 1rem;
            color: #D1D5DB;
          }
          .placeholder-text {
            color: #9CA3AF;
            font-style: italic;
          }
          .react-flow__attribution {
            display: none !important;
          }
        `}
      </style>

      <div className="container">
        <div className="wrapper">
          {/* 标题 */}
          <h1 className="title">流程图展示</h1>

          {/* 流程图区域 */}
          <div className="flowchart-container">
            <ReactFlow
              nodes={initialNodes}
              edges={initialEdges}
              onNodeClick={onNodeClick}
              fitView
              nodeTypes={{
                group: GroupNode,
              }}
            >
              {arrowHeads}
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>

          {/* 模块展示区域 */}
          <div id="module-details" className="module-details">
            {selectedModule ? (
              <div>
                <h2>{selectedModule.name}</h2>
                <p>{selectedModule.description}</p>
              </div>
            ) : (
              <p className="placeholder-text">请点击流程图中的节点查看模块详情。</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
