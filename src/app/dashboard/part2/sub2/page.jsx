"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Grid, Button, Select, MenuItem, TextField,
  Paper, Typography, Tabs, Tab,
  LinearProgress
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis
} from 'recharts';
import request from '@/lib/request/request';

import { algorithmCodeMap } from './algorithmCodeMap';
import { chartResults} from './chartResults';

const algorithms = ['CF', 'GCN', 'PR'];
const datasets = {
  CF: ['rmat-16', 'rmat-18', 'rmat-20', 'wiki-vote', 'web-google', 'slashdot08'],
  GCN: ['rmat-16', 'rmat-17', 'rmat-18', 'Cora', 'Citeseer', 'Pubmed'],
  PR: ['rmat-16', 'rmat-18', 'rmat-20', 'wiki-vote', 'web-google', 'ego-gplus'],
}

const logFileMap = {
  CF: {
    'rmat-16': 'cf_on_rmat_16',
    'rmat-18': 'cf_on_rmat_18',
    'rmat-20': 'cf_on_rmat_20',
    'wiki-vote': 'cf_on_wikivote',
    'web-google': 'cf_on_web_google',
    'slashdot08': 'cf_on_slashdot08'
  },
  GCN: {
    'rmat-16': 'gcn_on_rmat_16_x10',
    'rmat-17': 'gcn_on_rmat_17_x10',
    'rmat-18': 'gcn_on_rmat_18_x10',
    'Cora': 'gcn_on_cora_x10',
    'Citeseer': 'gcn_on_citeseer_x10',
    'Pubmed': 'gcn_on_pubmed_x10'
  },
  PR: {
    'rmat-16': 'pr_on_rmat_16',
    'rmat-18': 'pr_on_rmat_18',
    'rmat-20': 'pr_on_rmat_20',
    'wiki-vote': 'pr_on_wikivote',
    'web-google': 'pr_on_web_google',
    'ego-gplus': 'pr_on_ego_gplus'
  }
}

export default function Page() {
  const [selectedAlgo, setSelectedAlgo] = useState(algorithms[0]);
  const [selectedDataset, setSelectedDataset] = useState(datasets['CF'][0]);
  const [terminalData, setTerminalData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [displayCode, setDisplayCode] = useState(algorithmCodeMap[algorithms[0]]);
  const [isRunning, setIsRunning] = useState(false);
  const [chartMetric, setChartMetric] = useState('performance');
  const terminalRef = useRef(null); // 添加 ref 用于终端容器


  useEffect(() => {
    console.log('Selected Algorithm:', selectedAlgo, algorithmCodeMap);
    setDisplayCode(algorithmCodeMap[selectedAlgo]);
  }, [selectedAlgo]);

  // 添加 useEffect 监听 terminalData 变化并滚动到底部
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalData]);

  const generateChartData = () => {
    return chartResults[selectedAlgo][selectedDataset];
  };

  const streamLogData = async () => {
    const data = await request({
      url: `/logfile/${logFileMap[selectedAlgo][selectedDataset]}`,
      method: 'GET',
      responseType: 'text',
    })
    const logLines = data.split('\n');
    let currentIndex = 0;

    while (currentIndex < logLines.length) {
      const nextChunk = logLines.slice(currentIndex, currentIndex + 5);
      setTerminalData(prev => [...prev, ...nextChunk]);
      currentIndex += 5;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };


  const runProcess = async () => {
    setIsRunning(true);
    setTerminalData([]);
    setChartData([]);

    try {
      await streamLogData();
      const results = generateChartData();
      setChartData(results);
    } catch (error) {
      setTerminalData(prev => [...prev, '❌ 运行失败: ' + error]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f6fa',  }}>
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
            ① 标准图遍历算法 PageRank 计算性能，性能功耗比
          </Box>
          <Box component="span" display="block">
            ② 标准图挖掘算法 k-Clique 计算性能，性能功耗比
          </Box>
          <Box component="span" display="block">
            ③ 标准图学习算法 GCN 计算性能，性能功耗比
          </Box>

          <strong>中期指标：</strong>
          <Box component="span" display="block">
            ① 基于模拟器的图计算加速卡性能达到
            <span className='red-bold'>100GTEPS，</span>
            性能功耗比达到 <span className='red-bold'>2.5GTEPS/W</span>
          </Box>
          <Box component="span" display="block">
            ② 基于模拟器的图计算加速卡性能达到
            <span className='red-bold'>20GTSPS，</span>
            性能功耗比达到 <span className='red-bold'>0.5GTSPS/W</span>
          </Box>
          <Box component="span" display="block">
            ③ 基于模拟器的图计算加速卡性能达到
            <span className='red-bold'>20GOPS，</span>
            性能功耗比达到 <span className='red-bold'>0.5GOPS/W</span>
          </Box>

          <strong>完成时指标：</strong>
          <Box component="span" display="block">
            ① 基于图计算加速芯片的加速卡性能达到
            <span className='red-bold'>100GTEPS，</span>
            性能功耗比达到 <span className='red-bold'>2.5GTEPS/W</span>
          </Box>
          <Box component="span" display="block">
            ② 基于图计算加速芯片的加速卡性能达到
            <span className='red-bold'>20GTSPS，</span>
            性能功耗比达到 <span className='red-bold'>0.5GTSPS/W</span>
          </Box>
          <Box component="span" display="block">
            ③ 基于图计算加速芯片的加速卡性能达到
            <span className='red-bold'>20GOPS，</span>
            性能功耗比达到 <span className='red-bold'>0.5GOPS/W</span>
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
        {/* 控制面板 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              mb: 2,
              color: 'second.main',
              borderBottom: '2px solid',
              borderColor: 'second.main',
              pb: 1
            }}>
              运行选项
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                  <Typography variant="h6" sx={{
                    fontWeight: 550,
                    fontSize: '16px',
                    mb: 1,
                  }}>
                      选择算法
                  </Typography>
                  <Select
                    fullWidth
                    value={selectedAlgo}
                    onChange={(e) => {
                      setSelectedAlgo(e.target.value);
                      setSelectedDataset(datasets[e.target.value][0])
                    }
                  }
                    disabled={isRunning}
                  >
                    {algorithms.map((algo) => (
                      <MenuItem key={algo} value={algo} sx={{ py: 1 }}>
                        <Typography variant="body1" fontWeight="500">
                          {algo}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
              </Grid>

              <Grid item xs={12}>
                  <Typography variant="h6" sx={{
                    fontWeight: 550,
                    fontSize: '16px',
                    mb: 1,
                  }}>
                      选择数据集
                  </Typography>
                  <Select
                    value={selectedDataset}
                    onChange={(e) => setSelectedDataset(e.target.value)}
                    disabled={isRunning}
                    fullWidth
                  >
                    {datasets[selectedAlgo].map((dataset) => (
                      <MenuItem key={dataset} value={dataset} sx={{ py: 1 }}>
                        <Typography variant="body1">{dataset}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
              </Grid>

              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => setDisplayCode(algorithmCodeMap[selectedAlgo])}
                  sx={{ py: 1.5 }}
                  disabled={isRunning}
                >
                  刷新代码
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={runProcess}
                  sx={{ py: 1.5 }}
                  disabled={isRunning}
                >
                  {isRunning ? '运行中...' : '开始运行'}
                </Button>
              </Grid>
            </Grid>

            {isRunning && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress color="success" />
{/*                 <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  当前进度: {terminalData.length}/5 步骤
                </Typography> */}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 代码展示 */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{
            height: '800px',
            borderRadius: 3,
            overflow: 'hidden',
            p: 2,
          }}>
            <Typography variant="h6" sx={{
              p: 2,
              fontWeight: 700,
              mb: 2,
              color: 'second.main',
              borderBottom: '2px solid',
              borderColor: 'second.main',
              pb: 1
            }}>
              程序展示
            </Typography>
            <TextField
              fullWidth
              multiline
              value={displayCode}
              InputProps={{
                readOnly: true,
                sx: {
                  fontFamily: '"Fira Code", monospace',
                  fontSize: '0.85rem',
                  backgroundColor: '#1e1e1e',
                  color: '#d4d4d4',
                  overflow: 'auto',
                  alignItems: 'flex-start',
                  height: '700px',
                  '& textarea': {
                    whiteSpace: 'pre !important',
                    paddingTop: '16px !important'
                  }
                }
              }}
              variant="outlined"
            />
          </Paper>
        </Grid>

        {/* 运行日志 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{
            p: 2,
            borderRadius: 3,
          }}>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              mb: 2,
              color: 'second.main',
            }}>
              运行状态
            </Typography>

            <Box
            ref={terminalRef}
            sx={{
              height: '400px',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              backgroundColor: '#000',
              borderRadius: 2,
              height: 400,
              p: 1.5,
              '& > div': {
                color: '#4caf50',
                lineHeight: 1.6,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                py: 0.5
              }
            }}>
              {terminalData.map((line, index) => (
                <div key={index}>{`> ${line}`}</div>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* 分析结果 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{
            p: 2,
            borderRadius: 3,
            position: 'relative'
          }}>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              mb: 2,
              color: 'second.main',
            }}>
              结果展示
            </Typography>

            <Box sx={{height: 400}}>
              {chartData.length > 0 ? (
              <>
                <Tabs
                  value={chartMetric}
                  onChange={(e, v) => setChartMetric(v)}
                  sx={{ mb: 2 }}
                >
                  <Tab label="性能" value="performance" />
                  <Tab label="性能功耗比" value="consumption" />
                </Tabs>
                {chartMetric == 'performance' && (
                    <BarChart
                    data={chartData.slice(0, 2).filter(item => item.value !== null)}
                    margin={{ top: 40, right: 20, left: 20, bottom: 20 }} // 顶部留出40px给标题
                    width={580}
                    height={350}
                  >
                    {/* 图表标题（居中于BarChart） */}
                    <text
                      x="50%"
                      y={20} // 调整y坐标使其在顶部居中
                      textAnchor="middle"
                      style={{ fontSize: '16px', fontWeight: 'bold' }}
                    >
                      {`${selectedAlgo}-${selectedDataset} 性能测试结果`}
                    </text>

                    <XAxis dataKey="key" />
                    <YAxis
                      label={{
                        value: '性能值',
                        angle: -90,
                        position: 'insideLeft'
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#1976d2"
                      radius={[4, 4, 0, 0]}
                      barSize={100}
                      label={{
                        position: 'top',
                        formatter: (value) => value?.toFixed(5)
                      }}
                    />
                  </BarChart>
                  )
                }
                {
                  chartMetric == 'consumption' && (
                    <BarChart
                    data={chartData.slice(2, 4)}
                    margin={{ top: 40, right: 20, left: 20, bottom: 20 }} // 顶部留出40px给标题
                    width={580}
                    height={350}
                  >
                    {/* 图表标题（居中于BarChart） */}
                    <text
                      x="50%"
                      y={20} // 调整y坐标使其在顶部居中
                      textAnchor="middle"
                      style={{ fontSize: '16px', fontWeight: 'bold' }}
                    >
                      {`${selectedAlgo}-${selectedDataset} 功耗比测试结果`}
                    </text>

                    <XAxis dataKey="key" />
                    <YAxis
                      label={{
                        value: '性能值',
                        angle: -90,
                        position: 'insideLeft'
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#1976d2"
                      radius={[4, 4, 0, 0]}
                      barSize={100}
                      label={{
                        position: 'top',
                        formatter: (value) => value?.toFixed(5)
                      }}
                    />
                  </BarChart>
                  )
                }

              </>
              ) : (
                <Box sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary'
                }}>
                  <Typography variant="h6">
                    {isRunning ? '数据生成中...' : '等待运行结果'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
