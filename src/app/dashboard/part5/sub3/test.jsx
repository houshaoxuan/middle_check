"use client";

import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone'; // 使用 standalone 版本，避免依赖 vis.js 完整库

function NetworkGraph() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Pyvis 生成的节点和边数据（可从后端 API 获取）
    const nodes = [
      { id: 0, label: '0', title: 'Node 0', group: 1 },
      { id: 1, label: '1' },
      { id: 2, label: '2', title: 'Node 2', group: 2 },
      { id: 3, label: '3' },
      { id: 4, label: '4' },
    ];
    const edges = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 0 },
    ];

    // 配置选项（从 Pyvis 的 options 复制）
    const options = {
      physics: {
        forceAtlas2Based: {
          gravity: -50,
          centralGravity: 0.01,
          springLength: 100,
          springStrength: 0.08,
        },
      },
      nodes: {
        shape: 'dot',
        size: 20,
        font: { color: 'white' },
      },
      edges: {
        smooth: { type: 'dynamic' },
      },
    };

    // 初始化 Vis.js 网络
    const data = { nodes, edges };
    const network = new Network(containerRef.current, data, options);

    // 清理（组件卸载时销毁网络）
    return () => network.destroy();
  }, []);

  return (
    <div>
      <h2>Pyvis Network Graph in React</h2>
      <div
        ref={containerRef}
        style={{ height: '750px', width: '100%', background: '#222222' }}
      />
    </div>
  );
}

export default NetworkGraph;
