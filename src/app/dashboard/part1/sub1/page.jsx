'use client';

import React, { useState } from 'react';
import { Box, Button, Grid, LinearProgress, MenuItem, Paper, Select, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

import { extractMedianTepsValue } from '@/lib/utils';

import { PERFORMANCE_DATA } from './constData';

const algorithms = ['BFS', 'SSSP'];
const datasets = ['31_16.fjr'];

const isDev = true;

const bfs_url = isDev
  ? 'https://www.csdn.net/'
  : 'http://21.47.100.103:21025/#/views/graphQuery/query?cypher=CALL+agl.bfs(%22myGraph%22%2c%7bsource%3a%5b%22v%22%2c0%5d%2corientation%3a%22FORWARD%22%2creturnLimit%3a100000%7d)+YIELD+label%2c+pk%2c+level+RETURN+label%2c+pk%2c+level%3b&name=graph500';
const sssp_url = isDev
  ? 'https://www.csdn.net/'
  : 'http://21.47.100.103:21025/#/views/graphQuery/query?cypher=CALL+agl.sssp(%22myGraph%22%2c%7bsource%3a+%5b%22v%22%2c0%5d%2creturnLimit%3a1000%2creturnOrder%3a%22Ascending%22%2corientation%3a%22FORWARD%22%7d)+YIELD+label%2c+pk%2c+distance+RETURN+label%2c+pk%2c+distance%3b&name=graph500';

export default function Page() {
  const [selectedAlgo, setSelectedAlgo] = useState(algorithms[0]);
  const [selectedDataset, setSelectedDataset] = useState(datasets[0]);
  // 控制标签页切换
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [performanceData, setPerformanceData] = useState([]);

  const logBoxRef = React.useRef(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  };

  // 监听日志变化，自动滚动
  React.useEffect(() => {
    scrollToBottom();
  }, [logs]);

  // 判断按钮是否不可用
  const isButtonDisabled = () => running;

  // 获取有效数据（已执行的数据集）
  const getValidData = () => {
    return performanceData;
  };

  // 生成图表数据
  const getChartData = () => {
    return getValidData().map((item) => ({
      ...item,
      displayName: item.algorithm, // 用于显示的简化名称
      fullName: item.algorithm, // 用于tooltip显示的完整名称
    }));
  };

  const handleRun = async () => {
    if (running) return;

    setRunning(true);

    try {
      // 运行“全部数据集”，使用预设数据
      if (false) {
        setLogs((prev) => [...prev, '正在加载全部数据集...']);
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const allResults = PERFORMANCE_DATA[selectedAlgo].map((data) => ({
          algorithm: data.Algorithm,
          dataset: '31_16.fjr',
          throughput: data['GTEPS'],
        }));

        setPerformanceData(allResults);
        setLogs((prev) => [...prev, '全部数据集加载完成']);
        setRunning(false);
        return;
      }

      setLogs([`开始执行图算法 ${selectedAlgo}，数据集 ${selectedDataset}：`]);
      await new Promise((resolve) => setTimeout(resolve, 200));
      setLogs((prev) => [...prev, '正在与服务器建立连接...']);

      let urlDataset;

      switch (selectedDataset) {
        case '31_16.fjr':
          urlDataset = '31_16';
          break;
        default:
          urlDataset = '31_16';
      }

      // 1. 执行流式命令 /api/runTest?algorithn=hello&dataset=world
      const eventSource = new EventSource(
        `http://localhost:8000/api/runTest?algorithm=${selectedAlgo}&dataset=${urlDataset}`
      );

      eventSource.onmessage = async (event) => {
        console.log('Received event:', event.data);
        if (event.data === '[done]') {
          eventSource.close();
          setRunning(false);
          setLogs((prev) => [...prev, `✅ ${selectedAlgo}-${selectedDataset} 执行完成`]);
        } else if (event.data.includes('[error]')) {
          eventSource.close();
          setLogs((prev) => [...prev, `❌ 服务器执行出错：${event.data}`]);
          setRunning(false);
        } else {
          if (event.data.includes('median_TEPS')) {
            const tepsValue = extractMedianTepsValue(event.data);

            if (tepsValue !== null) {
              // 1. 定义新结果对象
              const newResult = {
                // 使用 selectedAlgo 和 selectedDataset 作为唯一标识
                combinedKey: `${selectedAlgo}-${selectedDataset}`,
                algorithm: selectedAlgo,
                dataset: selectedDataset, // 使用动态选中的数据集
                throughput: tepsValue,
              };

              // 2. 更新性能数据状态 (查找并替换/添加)
              setPerformanceData((prevPerformanceData) => {
                const existingIndex = prevPerformanceData.findIndex(
                  (item) => item.algorithm === selectedAlgo && item.dataset === selectedDataset
                );

                let newPerformanceData;

                if (existingIndex !== -1) {
                  // 发现旧结果：更新该位置的结果
                  newPerformanceData = [...prevPerformanceData];
                  newPerformanceData[existingIndex] = newResult;
                } else {
                  // 未发现旧结果：添加新结果到末尾
                  newPerformanceData = [...prevPerformanceData, newResult];
                }

                // 可选：如果需要按数据集顺序排序，可以在这里进行排序
                // return newPerformanceData.sort((a, b) => datasets.indexOf(a.dataset) - datasets.indexOf(b.dataset));

                return newPerformanceData;
              });
            }
          }
          setLogs((prev) => [...prev, `${event.data}`]);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setLogs((prev) => [...prev, `❌ ${selectedAlgo}-${selectedDataset} 连接错误`]);
        setRunning(false);
      };

      // 等待当前数据集处理完成
      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!eventSource.readyState || eventSource.readyState === 2) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
    } catch (error) {
      setLogs((prev) => [...prev, `❌ 执行失败: ${error.message}`]);
      setRunning(false);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f6fa' }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: '#f0f4f8',
              border: '1px solid #e0e0e0',
              height: 350,
            }}
          >
            <Typography
              variant="body1"
              component="div"
              sx={{
                lineHeight: 1.6,
                color: '#2d3436',
                fontSize: '0.95rem',
                '& .red-bold': {
                  fontWeight: 600,
                  color: '#ff4444',
                  display: 'inline',
                  padding: '0 2px',
                },
                '& strong': {
                  fontWeight: 600,
                },
              }}
            >
              <strong style={{ fontSize: '16px' }}>考核指标</strong>
              <Box component="span" display="block">
                引擎计算加速能力（核心指标1）
              </Box>
              <strong style={{ fontSize: '16px' }}>完成时指标：</strong>
              <Box component="span" display="block">
                单机BFS和SSSP性能达到 <span className="red-bold">5000和4000GTEPS</span>
              </Box>
              <strong style={{ fontSize: '16px' }}>考核方式：</strong>
              <Box component="span" display="block">
                <Box>采用Graph500标准数据集运行BFS和SSSP代码，进行实际性能测试</Box>
              </Box>

              <strong style={{ fontSize: '16px' }}>数据集来源：</strong>
              <Box component="span" display="block">
                采用Graph500标准数据集31_16.fjr
              </Box>
            </Typography>
          </Paper>
        </Grid>
        <Grid item md={4}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 350 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: 'secondary.main',
                borderBottom: '2px solid',
                borderColor: 'secondary.main',
                pb: 1,
              }}
            >
              算法选择
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 550, mb: 1 }}>
              选择图算法
            </Typography>
            <Select fullWidth value={selectedAlgo} onChange={(e) => setSelectedAlgo(e.target.value)} sx={{ mb: 2 }}>
              {algorithms.map((algo) => (
                <MenuItem key={algo} value={algo}>
                  {algo}
                </MenuItem>
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
              {datasets.map((ds) => (
                <MenuItem key={ds} value={ds}>
                  {ds}
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="contained"
              fullWidth
              onClick={handleRun}
              disabled={isButtonDisabled()}
              color="success"
              sx={{ py: 1.5 }}
            >
              {running ? '执行中...' : '开始执行'}
            </Button>
            {running && <LinearProgress sx={{ mt: 1 }} />}
          </Paper>
        </Grid>
        <Grid item md={7}>
          {/* 控制台输出 */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                height: 500,
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: 'secondary.main',
                  borderBottom: '2px solid',
                  borderColor: 'secondary.main',
                  pb: 1,
                }}
              >
                执行日志
              </Typography>
              <Box
                sx={{
                  height: 430,
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
                    py: 0.5,
                  },
                }}
                ref={logBoxRef}
              >
                {logs.map((log, index) => (
                  <div key={index}>{`> ${log}`}</div>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Grid item md={5}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: 'secondary.main',
                  borderBottom: '2px solid',
                  borderColor: 'secondary.main',
                  pb: 1,
                }}
              >
                性能对比详情
              </Typography>

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 550, mb: 1 }}>
                  图表视图
                </Typography>
              </Box>

              <Box>
                <BarChart
                  width={450}
                  height={370}
                  data={getChartData()}
                  margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayName" />
                  <YAxis
                    width={120}
                    axisLine={true} // 可选，确保坐标轴线显示
                    tickLine={true} // 可选，确保刻度线显示
                    label={{
                      value: 'GTEPS', // 这里填写您的单位，比如 '单位 (s)' 或 '单位 (ms)'
                      angle: -90, // 旋转90度，垂直显示
                      position: 'center',
                    }}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      return [value, name];
                    }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0] && payload[0].payload) {
                        return payload[0].payload.fullName;
                      }
                      return label;
                    }}
                  />
                  <Legend />
                  <>
                    <Bar dataKey="throughput" fill="#7f58af" name="算法性能" barSize={50} />
                  </>
                </BarChart>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Grid item md={12} sx={{ mt: 2, mb: 2,ml:3, backgroundColor: '#ffffff',  borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'secondary.main',
              borderBottom: '2px solid',
              borderColor: 'secondary.main',
              pb: 1,
              mr: 2,
            }}
          >
            图库BFS页面
          </Typography>
          <div
            style={{
              width: '100%',
              height: '800px',
            }}
          >
            <iframe
              src={bfs_url}
              width="100%"
              height="100%"
              title="Embedded Page"
              style={{
                border: 'none',
              }}
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms"
              allow="same-origin allow-scripts allow-popups allow-forms allow-storage-access-by-user-activation"
            ></iframe>
          </div>
        </Grid>
        <Grid item md={12} sx={{ mt: 2, mb: 2,ml:3, backgroundColor: '#ffffff',  borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'secondary.main',
              borderBottom: '2px solid',
              borderColor: 'secondary.main',
              pb: 1,
              mr: 2,
            }}
          >
            图库SSSP页面
          </Typography>
          <div
            style={{
              width: '100%',
              height: '800px',
            }}
          >
            <iframe
              src={sssp_url}
              width="100%"
              height="100%"
              title="Embedded Page"
              style={{
                border: 'none',
              }}
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms"
              allow="same-origin allow-scripts allow-popups allow-forms allow-storage-access-by-user-activation"
            ></iframe>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
