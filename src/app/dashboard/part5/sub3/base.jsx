"use client";

import React, { useState } from 'react';
import NetworkGraph from './NetworkGraph';

// 模拟数据
const socialNetworkData = {
  nodes: [
    { id: 1, label: 'Alice', color: 'yellow', title: 'User Alice' },
    { id: 2, label: 'Bob', color: 'red', title: 'User Bob' },
    { id: 3, label: 'Charlie', color: 'yellow', title: 'User Charlie' },
    { id: 4, label: 'David', color: 'red', title: 'User David' },
    { id: 5, label: 'Eve', color: 'yellow', title: 'User Eve' },
  ],
  edges: [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 1 },
    { from: 1, to: 3 },
  ],
};

const orgStructureData = {
  nodes: [
    { id: 'CEO', label: 'CEO', color: 'red', title: 'Chief Executive Officer' },
    { id: 'CTO', label: 'CTO', color: 'yellow', title: 'Chief Technology Officer' },
    { id: 'CFO', label: 'CFO', color: 'yellow', title: 'Chief Financial Officer' },
    { id: 'DEV1', label: '1', color: 'red', title: 'Frontend Developer' },
    { id: 'DEV2', label: '2', color: 'red', title: 'Backend Developer' },
  ],
  edges: [
    { from: 'CEO', to: 'CTO' },
    { from: 'CEO', to: 'CFO' },
    { from: 'CTO', to: 'DEV1' },
    { from: 'CTO', to: 'DEV2' },
  ],
};

function App() {
  const [graphData, setGraphData] = useState(socialNetworkData);

  // 自定义选项
  const customOptions = {
    nodes: {
      color: {
        border: '#ffffff',
        highlight: { border: '#ffffff', background: '#ff9900' },
      },
    },
    edges: {
      color: { color: '#848484', highlight: '#ff9900' },
    },
  };

  return (
    <div className="App">
      <h1>Vis.js Network Graph in React</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setGraphData(socialNetworkData)}>
          Show Social Network
        </button>
        <button onClick={() => setGraphData(orgStructureData)}>
          Show Organization Structure
        </button>
      </div>
      <NetworkGraph
        nodes={graphData.nodes}
        edges={graphData.edges}
        options={customOptions}
        height="750px"
        width="100%"
      />
    </div>
  );
}

export default App;
