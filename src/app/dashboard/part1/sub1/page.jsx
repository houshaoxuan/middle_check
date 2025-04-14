"use client";
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const algorithms = ['PageRank', 'k-Clique', 'GCN'];
const datasets = ['Web-Google', 'RoadNet-CA', 'Social-Slashdot'];
const allDatasetsOption = 'all-datasets';

const algorithmDetails = {
  PageRank: {
    description: '迭代式网页排名算法',
    complexity: 'O(kE)',
    parameters: '阻尼系数: 0.85, 迭代次数: 20',
  },
  'k-Clique': {
    description: '寻找k阶完全子图',
    complexity: 'O(n^k)',
    parameters: 'k值: 5, 最小规模: 10',
  },
  GCN: {
    description: '图卷积神经网络',
    complexity: 'O(L(n + m))',
    parameters: '层数: 3, 特征维度: 128',
  },
};

const datasetInfo = {
  'Web-Google': { nodes: 875713, edges: 5105039 },
  'RoadNet-CA': { nodes: 1965206, edges: 2766607 },
  'Social-Slashdot': { nodes: 82168, edges: 948464 },
};

export default function Page() {
  const [selectedAlgo, setSelectedAlgo] = useState(algorithms[0]);
  const [selectedDataset, setSelectedDataset] = useState(datasets[0]);
  const [tabValue, setTabValue] = useState(0);
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [performanceData, setPerformanceData] = useState([]);
  const [chartMetric, setChartMetric] = useState('time');

  // 生成随机性能数据
  const generatePerformanceData = (dataset) => {
    const baseData = datasetInfo[dataset];
    return {
      dataset,
      nodes: baseData.nodes,
      edges: baseData.edges,
      cpu: Math.random() * 50 + 10,
      accelerator: Math.random() * 10 + 2,
      throughput: Math.random() * 200 + 400
    };
  };

  // 获取有效数据（已执行的数据集）
  const getValidData = () => {
    return performanceData.filter(item =>
      typeof item.cpu === 'number' &&
      typeof item.accelerator === 'number'
    );
  };

  // 生成图表数据
  const getChartData = () => {
    return getValidData().map(item => ({
      dataset: item.dataset,
      cpu: item.cpu,
      accelerator: item.accelerator,
      speedup: item.cpu / item.accelerator,
      throughput: item.throughput
    }));
  };

  const handleRun = async () => {
    setRunning(true);

    try {
      const targets = selectedDataset === allDatasetsOption
        ? datasets
        : [selectedDataset];

      // 批量执行任务
      for (const dataset of targets) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 开始执行 ${selectedAlgo} - ${dataset}`]);

        // 模拟执行过程
        await mockProcess('加载数据集元数据', dataset);
        await mockProcess('初始化加速器环境', dataset);

        // 生成模拟结果
        const newResult = generatePerformanceData(dataset);

        // 更新性能数据
        setPerformanceData(prev => {
          const filtered = prev.filter(item => item.dataset !== dataset);
          return [...filtered, newResult]
            .sort((a, b) => datasets.indexOf(a.dataset) - datasets.indexOf(b.dataset));
        });

        await mockProcess('生成性能报告', dataset);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ ${dataset} 执行成功`]);
      }
    } catch (error) {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ❌ 执行失败: ${error}`]);
    } finally {
      setRunning(false);
    }
  };

  // 模拟异步操作
  const mockProcess = async (message) => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f6fa' }}>
      <Grid item xs={12} sx={{ mb: 3 }}>
        <Paper elevation={0} sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: '#f0f4f8',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="body1" component="div" sx={{
            lineHeight: 1.6,
            color: '#2d3436',
            fontSize: '0.95rem',
            '& .red-bold': {
              fontWeight: 600,
              color: '#ff4444',
              display: 'inline',
              padding: '0 2px'
            },
            '& strong': {
              fontWeight: 600
            }
          }}>
            <strong>考核指标</strong>
            <Box component="span" display="block">
              ① 标准图遍历算法 PageRank 计算性能
            </Box>
            <Box component="span" display="block">
              ② 标准图挖掘算法 k-Clique 计算性能
            </Box>
            <Box component="span" display="block">
              ③ 标准图学习算法 GCN 计算性能
            </Box>

            <strong>中期指标：</strong>
            <Box component="span" display="block">
              ① 基于FPGA的图计算加速器性能达到
              <span className='red-bold'>6GTEPS</span>
            </Box>
            <Box component="span" display="block">
              ② 基于FPGA的图计算加速器性能达到
              <span className='red-bold'>1.5GTSPS</span>
            </Box>
            <Box component="span" display="block">
              ③ 基于FPGA的图计算加速器性能达到
              <span className='red-bold'>1GOPS</span>
            </Box>

            <strong>完成时指标：</strong>
            <Box component="span" display="block">
              ① 基于FPGA的图计算加速器性能达到
              <span className='red-bold'>10GTEPS</span>
            </Box>
            <Box component="span" display="block">
              ② 基于FPGA的图计算加速器性能达到
              <span className='red-bold'>2GTSPS</span>
            </Box>
            <Box component="span" display="block">
              ③ 基于FPGA的图计算加速器性能达到
              <span className='red-bold'>2GOPS</span>
            </Box>

            <strong>考核方式：</strong>
            <Box component="span" display="block">
              采用Graph500标准数据集运行PageRank、k-Clique和GCN
              代码，进行实际性能测试。基准系统采用
              2023年11月立项时的最新软件版本，
              运行环境依托主流处理器Intel Xeon Gold 6338 CPU
            </Box>

            <strong>数据集来源：</strong>
            <Box component="span" display="block">
              采用Graph500标准数据集
            </Box>
          </Typography>
        </Paper>
    </Grid>
      <Grid container spacing={3}>
        {/* 左侧列 */}
        <Grid container item xs={12} md={4} spacing={3}>
          {/* 算法选择卡片 */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="h6" sx={{
                fontWeight: 700,
                mb: 2,
                color: 'secondary.main',
                borderBottom: '2px solid',
                borderColor: 'secondary.main',
                pb: 1
              }}>
                算法选择
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 550, mb: 1 }}>
                选择图算法
              </Typography>
              <Select
                fullWidth
                value={selectedAlgo}
                onChange={(e) => setSelectedAlgo(e.target.value)}
                sx={{ mb: 2 }}
              >
                {algorithms.map(algo => (
                  <MenuItem key={algo} value={algo}>{algo}</MenuItem>
                ))}
              </Select>

              <Typography variant="subtitle1" sx={{ fontWeight: 550, mb: 1 }}>
                选择数据集
              </Typography>
              <Select
                fullWidth
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                sx={{ mb: 2 }}
              >
                {datasets.map(ds => (
                  <MenuItem key={ds} value={ds}>{ds}</MenuItem>
                ))}
                <MenuItem value={allDatasetsOption}>全部数据集</MenuItem>
              </Select>

              <Button
                variant="contained"
                fullWidth
                onClick={handleRun}
                disabled={running}
                color="success"
                sx={{ py: 1.5 }}
              >
                {running ? '执行中...' : '开始执行'}
              </Button>
            </Paper>
          </Grid>

          {/* 算法详情卡片 */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="h6" sx={{
                fontWeight: 700,
                mb: 2,
                color: 'secondary.main',
                borderBottom: '2px solid',
                borderColor: 'secondary.main',
                pb: 1
              }}>
                算法详情
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>算法类型:</strong> {algorithmDetails[selectedAlgo].description}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>时间复杂度:</strong> {algorithmDetails[selectedAlgo].complexity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>参数设置:</strong> {algorithmDetails[selectedAlgo].parameters}
              </Typography>
            </Paper>
          </Grid>

          {/* 数据集信息卡片 */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="h6" sx={{
                fontWeight: 700,
                mb: 2,
                color: 'secondary.main',
                borderBottom: '2px solid',
                borderColor: 'secondary.main',
                pb: 1
              }}>
                {selectedDataset === allDatasetsOption ? '数据集概览' : '数据集信息'}
              </Typography>
              {selectedDataset === allDatasetsOption ? (
                <Box>
                  {datasets.map(ds => (
                    <Box key={ds} sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>{ds}:</strong>
                        节点数 {datasetInfo[ds].nodes.toLocaleString()},
                        边数 {datasetInfo[ds].edges.toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>节点数:</strong> {datasetInfo[selectedDataset].nodes.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>边数:</strong> {datasetInfo[selectedDataset].edges.toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* 右侧列 */}
        <Grid container item xs={12} md={8} spacing={3}>
          {/* 控制台输出 */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{
              p: 2,
              height: 300,
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <Typography variant="h6" sx={{
                fontWeight: 700,
                mb: 2,
                color: 'secondary.main',
                borderBottom: '2px solid',
                borderColor: 'secondary.main',
                pb: 1
              }}>
                执行日志
              </Typography>
              <Box sx={{
                height: 230,
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                backgroundColor: '#1a1a1a',
                borderRadius: 2,
                p: 1.5,
                '& > div': {
                  color: '#4caf50',
                  lineHeight: 1.6,
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  py: 0.5
                }
              }}>
                {logs.map((log, index) => (
                  <div key={index}>{`> ${log}`}</div>
                ))}
                {running && <LinearProgress sx={{ mt: 1 }} />}
              </Box>
            </Paper>
          </Grid>

          {/* 性能对比卡片 */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="h6" sx={{
                fontWeight: 700,
                mb: 2,
                color: 'secondary.main',
                borderBottom: '2px solid',
                borderColor: 'secondary.main',
                pb: 1
              }}>
                性能对比详情
              </Typography>

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                  <Tab label="表格视图" />
                  <Tab label="图表视图" />
                </Tabs>
              </Box>

              {tabValue === 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>数据集</TableCell>
                        <TableCell>节点数</TableCell>
                        <TableCell>边数</TableCell>
                        <TableCell>CPU时间(s)</TableCell>
                        <TableCell>加速器时间(s)</TableCell>
                        <TableCell>加速比</TableCell>
                        <TableCell>吞吐量(GTEPS)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getValidData().map((row) => (
                        <TableRow key={row.dataset}>
                          <TableCell>{row.dataset}</TableCell>
                          <TableCell>{row.nodes.toLocaleString()}</TableCell>
                          <TableCell>{row.edges.toLocaleString()}</TableCell>
                          <TableCell>{row.cpu.toFixed(2)}</TableCell>
                          <TableCell>{row.accelerator.toFixed(2)}</TableCell>
                          <TableCell>{(row.cpu / row.accelerator).toFixed(1)}x</TableCell>
                          <TableCell>{Math.round(row.throughput)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box>
                  <Tabs
                    value={chartMetric}
                    onChange={(e, v) => setChartMetric(v)}
                    sx={{ mb: 2 }}
                  >
                    <Tab label="执行时间" value="time" />
                    <Tab label="加速比" value="speedup" />
                    <Tab label="吞吐量" value="throughput" />
                  </Tabs>

                  <LineChart
                    width={800}
                    height={300}
                    data={getChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dataset" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {chartMetric === 'time' && (
                      <>
                        <Line
                          type="linear"
                          dataKey="cpu"
                          stroke="#7f58af"
                          strokeWidth={2}
                          name="CPU时间"
                          dot={{
                            r: 5,
                            fill: '#7f58af',
                            strokeWidth: 1
                          }}
                          activeDot={{ r: 8 }}
                          animationDuration={0}
                        />
                        <Line
                          type="linear"
                          dataKey="accelerator"
                          stroke="#64b5f6"
                          strokeWidth={2}
                          name="加速器时间"
                          dot={{
                            r: 5,
                            fill: '#64b5f6',
                            strokeWidth: 1
                          }}
                          activeDot={{ r: 8 }}
                          animationDuration={0}

                        />
                      </>
                    )}

                    {chartMetric === 'speedup' && (
                      <Line
                        type="linear"
                        dataKey="speedup"
                        stroke="#ef5350"
                        strokeWidth={2}
                        name="加速比"
                        dot={{
                          r: 5,
                          fill: '#ef5350',
                          strokeWidth: 1
                        }}
                        activeDot={{ r: 8 }}
                        animationDuration={0}

                      />
                    )}

                    {chartMetric === 'throughput' && (
                      <Line
                        type="linear"
                        dataKey="throughput"
                        stroke="#26a69a"
                        strokeWidth={2}
                        name="吞吐量"
                        dot={{
                          r: 5,
                          fill: '#26a69a',
                          strokeWidth: 1
                        }}
                        activeDot={{ r: 8 }}
                        animationDuration={0}

                      />
                    )}
                  </LineChart>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      {/* 代码转化卡片 */}
      <Grid item xs={12} sx={{ mt: 2 }}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="h6" sx={{
                fontWeight: 700,
                mb: 2,
                color: 'secondary.main',
                borderBottom: '2px solid',
                borderColor: 'secondary.main',
                pb: 1
              }}>
                代码映射
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{
                    p: 1,
                    height: 300,
                    overflow: 'auto',
                    backgroundColor: '#1e1e1e',
                    borderRadius: 2
                  }}>
                    <Typography variant="subtitle2" sx={{ color: '#d4d4d4', mb: 1 }}>
                      原始算法代码
                    </Typography>
                    <pre style={{
                      fontSize: '0.8rem',
                      color: '#d4d4d4',
                      fontFamily: '"Fira Code", monospace',
                      margin: 0
                    }}>
                      {algorithmDetails[selectedAlgo].parameters}
                    </pre>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{
                    p: 1,
                    height: 300,
                    overflow: 'auto',
                    backgroundColor: '#1e1e1e',
                    borderRadius: 2
                  }}>
                    <Typography variant="subtitle2" sx={{ color: '#d4d4d4', mb: 1 }}>
                      加速器映射代码
                    </Typography>
                    <pre style={{
                      fontSize: '0.8rem',
                      color: '#d4d4d4',
                      fontFamily: '"Fira Code", monospace',
                      margin: 0
                    }}>
                      {`// ${selectedAlgo} 加速器优化代码\n// 矩阵化优化实现...`}
                    </pre>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
    </Box>
  );
}
