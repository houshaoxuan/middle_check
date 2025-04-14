"use client";
import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Button, Select, MenuItem, TextField,
  Paper, Typography, FormControl, InputLabel,
  LinearProgress
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const algorithms = ['SVM', 'Random Forest', 'Neural Network'];
const datasets = ['Iris', 'MNIST', 'CIFAR-10', 'Boston Housing', 'Diabetes', 'Wine'];

const algorithmCodeMap = {
  'SVM': `// SVM示例代码
import SVM from 'ml-svm';

const svm = new SVM({
  kernel: 'rbf',
  gamma: 0.5,
  C: 1.0
});

svm.train(trainData, trainLabels);
return svm.predict(testData);import SVM from 'ml-svm';

const svm = new SVM({
  kernel: 'rbf',
  gamma: 0.5,
  C: 1.0
});

svm.train(trainData, trainLabels);
return svm.predict(testData);import SVM from 'ml-svm';

const svm = new SVM({
  kernel: 'rbf',
  gamma: 0.5,
  C: 1.0
});

svm.train(trainData, trainLabels);
return svm.predict(testData);import SVM from 'ml-svm';

const svm = new SVM({
  kernel: 'rbf',
  gamma: 0.5,
  C: 1.0
});

svm.train(trainData, trainLabels);
return svm.predict(testData);import SVM from 'ml-svm';

const svm = new SVM({
  kernel: 'rbf',
  gamma: 0.5,
  C: 1.0
});

svm.train(trainData, trainLabels);
return svm.predict(testData);import SVM from 'ml-svm';

const svm = new SVM({
  kernel: 'rbf',
  gamma: 0.5,
  C: 1.0
});

svm.train(trainData, trainLabels);
return svm.predict(testData);`,

  'Random Forest': `// 随机森林示例代码
import { RandomForestClassifier } from 'ml-random-forest';

const options = {
  seed: 42,
  maxFeatures: 'sqrt',
  replacement: true,
  nEstimators: 100
};

const classifier = new RandomForestClassifier(options);
classifier.train(trainData, trainLabels);
return classifier.predict(testData);`,

  'Neural Network': `// 神经网络示例代码
import { Sequential, Dense } from 'tfjs-layers';

const model = new Sequential();
model.add(Dense({units: 64, activation: 'relu', inputShape: [inputSize]}));
model.add(Dense({units: 32, activation: 'relu'}));
model.add(Dense({units: outputSize, activation: 'softmax'}));

model.compile({
  optimizer: 'adam',
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy']
});

await model.fit(trainData, trainLabels, {
  epochs: 50,
  batchSize: 32,
  validationSplit: 0.2
});`
};

export default function Page() {
  const [selectedAlgo, setSelectedAlgo] = useState(algorithms[0]);
  const [selectedDataset, setSelectedDataset] = useState(datasets[0]);
  const [terminalData, setTerminalData] = useState(['系统准备就绪']);
  const [chartData, setChartData] = useState([]);
  const [displayCode, setDisplayCode] = useState(algorithmCodeMap[algorithms[0]]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setDisplayCode(algorithmCodeMap[selectedAlgo]);
  }, [selectedAlgo]);

  const generateMockData = () => {
    const metrics = ['准确率', '精确率', '召回率', 'F1分数'];
    return metrics.map((metric, index) => ({
      指标: metric,
      值: Math.random() * 40 + 60,
      算法: selectedAlgo,
      数据集: selectedDataset
    }));
  };

  const runProcess = async () => {
    setIsRunning(true);
    setTerminalData(['初始化运行环境...']);
    setChartData([]);

    try {
      await mockBackendCall('开始预处理数据');
      await mockBackendCall('特征工程处理中');
      await mockBackendCall('模型训练中...');
      await mockBackendCall('模型评估阶段');

      const results = generateMockData();
      setChartData(results);
      setTerminalData(prev => [...prev, '✅ 运行成功']);
    } catch (error) {
      setTerminalData(prev => [...prev, '❌ 运行失败: ' + error]);
    } finally {
      setIsRunning(false);
    }
  };

  const mockBackendCall = async (message) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setTerminalData(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
        resolve();
      }, 1000);
    });
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
                    onChange={(e) => setSelectedAlgo(e.target.value)}
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
                    {datasets.map((dataset) => (
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

            <Box sx={{
              height: '85%',
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
                <ResponsiveContainer width="100%" height='100%'>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="指标"
                      label={{
                        value: '评估指标',
                        position: 'bottom',
                        offset: -20
                      }}
                      height={60}
                    />
                    <YAxis
                      label={{
                        value: '性能值 (%)',
                        angle: -90,
                        position: 'insideLeft'
                      }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      formatter={(value) => [`${value.toFixed(2)}%`, '性能值']}
                      contentStyle={{ borderRadius: 4 }}
                    />
                    <Legend
                      verticalAlign="top"
                      wrapperStyle={{ paddingBottom: 10 }}
                    />
                    <Bar
                      dataKey="值"
                      fill="#4caf50"
                      radius={[4, 4, 0, 0]}
                      name="性能指标"
                    />
                  </BarChart>
                </ResponsiveContainer>
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
