import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone';
import PropTypes from 'prop-types';

const NetworkGraph = ({ nodes, edges, options, height = '750px', width = '100%' }) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 默认配置，确保节点为圆形
    const defaultOptions = {
      nodes: {
        shape: 'dot', // 使用圆形节点
        size: 20, // 统一节点大小
        font: {
          size: 12,
          color: 'black',
        },
        borderWidth: 2,
      },
      edges: {
        width: 2,
        smooth: { type: 'dynamic' },
      },
      physics: {
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.08,
        },
        maxVelocity: 50,
        solver: 'forceAtlas2Based',
        stabilization: { iterations: 100 },
      },
      interaction: {
        hover: true,
        zoomView: true,
        dragView: true,
        dragNodes: true,
      },
    };

    // 合并默认和自定义配置
    const mergedOptions = { ...defaultOptions, ...options };

    // 创建 Vis.js 网络
    const data = { nodes, edges };
    networkRef.current = new Network(containerRef.current, data, mergedOptions);

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [nodes, edges, options]);

  return (
    <div
      ref={containerRef}
      style={{
        height,
        width,
        background: '#ffffff',
        border: '1px solid #444',
      }}
    />
  );
};

NetworkGraph.propTypes = {
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      label: PropTypes.string,
      color: PropTypes.string,
      title: PropTypes.string,
    })
  ).isRequired,
  edges: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      to: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    })
  ).isRequired,
  options: PropTypes.object,
  height: PropTypes.string,
  width: PropTypes.string,
};

export default NetworkGraph;
