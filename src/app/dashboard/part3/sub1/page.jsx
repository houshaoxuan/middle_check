"use client";
import React, { useState } from 'react';
import {
  Box, Grid, Button, Select, MenuItem,
  Paper, Typography, LinearProgress
} from '@mui/material';
import ReadOnlyCodeBox from './CodeContainer';
import request from '@/lib/request/request';

const algorithms = ['bfs', 'sssp', 'wcc', 'kcore', 'k-Clique', 'ppr', 'gcn'];

export default function Page() {
  const [selectedAlgo, setSelectedAlgo] = useState(algorithms[0]);
  // const [step, setStep] = useState(0);
  const [results, setResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showButtons, setShowButtons] = useState({
    '编程接口示例': false,
    'graphIR示例': false,
    'MatrixIR示例': false,
    '硬件指令示例': false
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [simulatorResults, setSimulatorResults] = useState('');
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false);
  const [simulatorProgress, setSimulatorProgress] = useState(0);

  const resultsBoxRef = React.useRef(null);
  const simulatorBoxRef = React.useRef(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    if (resultsBoxRef.current) {
      resultsBoxRef.current.scrollTop = resultsBoxRef.current.scrollHeight;
    }
    if (simulatorBoxRef.current) {
      simulatorBoxRef.current.scrollTop = simulatorBoxRef.current.scrollHeight;
    }
  };

  // 自动滚动
  React.useEffect(() => {
    scrollToBottom();
  }, [results, simulatorResults]);


  const handleAlgoChange = (event) => {
    setSelectedAlgo(event.target.value);
    setResults({});
    setProgress(0);
    setShowButtons({
      '编程接口示例': false,
      'graphIR示例': false,
      'MatrixIR示例': false,
      '硬件指令示例': false
    });
    setCurrentStep(0);
  };

  const handleRun = async () => {
    if (isRunning) {
      return;
    }

    setIsRunning(true);
    
    setProgress(0);
    setResults({ 'Terminal执行结果': '正在与服务器建立连接...\n' });
    setShowButtons({
      '编程接口示例': false,
      'graphIR示例': false,
      'MatrixIR示例': false,
      '硬件指令示例': false
    });
    setCurrentStep(0);

    try {
      let urlAlgo;
      switch(selectedAlgo) {
        case 'bfs': urlAlgo = 'bfs'; break;
        case 'sssp': urlAlgo = 'sssp'; break;
        case 'wcc': urlAlgo = 'wcc'; break;
        case 'kcore': urlAlgo = 'kcore'; break;
        case 'k-Clique': urlAlgo = 'cf'; break;
        case 'ppr': urlAlgo = 'ppr'; break;
        case 'gcn': urlAlgo = 'gcn'; break;
        default: throw new Error(`不支持的算法: ${selectedAlgo}`);
      }

      // 1. 执行流式命令
      const eventSource = new EventSource(`${request.BASE_URL}/part3/execute/1/${urlAlgo}/`);

      eventSource.onmessage = async (event) => {
        if (event.data === '[done]') {
          eventSource.close();
          
          // 2. 显示正在拷贝result
          setResults(prev => ({
            'Terminal执行结果': prev['Terminal执行结果'] + '正在拷贝result\n'
          }));
          
          // 3. 获取最终结果
          try {
            const res = await fetch(`${request.BASE_URL}/part3/result/1/${urlAlgo}/`);
            const jsonData = await res.json();
            
            // 4. 显示完成
            setResults(prev => ({
              'Terminal执行结果': prev['Terminal执行结果'] + '完成\n'
            }));
            
            setProgress(100);
            setShowButtons(prev => ({
              ...prev,
              '编程接口示例': true
            }));
            
          } catch (error) {
            setResults(prev => ({
              'Terminal执行结果': prev['Terminal执行结果'] + `获取结果失败: ${error.message}\n`
            }));
          } finally {
            setIsRunning(false);
          }
          
        } else if (event.data === '[error]') {
          eventSource.close();
          setResults(prev => ({
            'Terminal执行结果': prev['Terminal执行结果'] + '\n执行出错\n'
          }));
          setIsRunning(false);
        } else {
          setResults(prev => ({
            'Terminal执行结果': prev['Terminal执行结果'] + event.data + '\n'
          }));
        }
      };
      
      eventSource.onerror = () => {
        eventSource.close();
        setResults(prev => ({
          'Terminal执行结果': prev['Terminal执行结果'] + '\n连接错误\n'
        }));
        setIsRunning(false);
      };

    } catch (error) {
      console.error('执行失败:', error);
      setResults({
        'Terminal执行结果': `执行失败: ${error.message}`
      });
    }
  };

  const handleSimulatorRun = async () => {
    if (isSimulatorRunning) {
      return;
    }

    setIsSimulatorRunning(true);
    setSimulatorProgress(0);
    setSimulatorResults('正在与服务器建立连接...\n');

    try {
      let urlAlgo;
      switch(selectedAlgo) {
        case 'bfs': urlAlgo = 'bfs'; break;
        case 'sssp': urlAlgo = 'sssp'; break;
        case 'wcc': urlAlgo = 'wcc'; break;
        case 'kcore': urlAlgo = 'kcore'; break;
        case 'k-Clique': urlAlgo = 'cf'; break;
        case 'ppr': urlAlgo = 'ppr'; break;
        case 'gcn': urlAlgo = 'gcn'; break;
        default: throw new Error(`不支持的算法: ${selectedAlgo}`);
      }
      const eventSource = new EventSource(`${request.BASE_URL}/part3/moni/${urlAlgo}/`);

      eventSource.onmessage = (event) => {
        if (event.data === '[done]') {
          eventSource.close();
          setSimulatorResults(prev => prev + '模拟器执行完成\n');
          setSimulatorProgress(100);
          setIsSimulatorRunning(false);
        } else if (event.data === '[error]') {
          eventSource.close();
          setSimulatorResults(prev => prev + '\n执行出错\n');
          setIsSimulatorRunning(false);
        } else {
          setSimulatorResults(prev => prev + event.data + '\n');
          setSimulatorProgress(prev => Math.min(prev + 5, 95));
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setSimulatorResults(prev => prev + '\n连接错误\n');
        setIsSimulatorRunning(false);
      };

    } catch (error) {
      console.error('模拟器执行失败:', error);
      setSimulatorResults(`执行失败: ${error.message}`);
      setIsSimulatorRunning(false);
    }
  };

  const exampleTypeMapping = {
    '编程接口示例': 'CGA',
    'graphIR示例': 'GraphIR',
    'MatrixIR示例': 'MatrixIR',
    '硬件指令示例': 'asm'
  };

  const handleShowExample = async (exampleName) => {
    let urlAlgo;
    switch(selectedAlgo) {
      case 'bfs': urlAlgo = 'bfs'; break;
      case 'sssp': urlAlgo = 'sssp'; break;
      case 'wcc': urlAlgo = 'wcc'; break;
      case 'kcore': urlAlgo = 'kcore'; break;
      case 'k-Clique': urlAlgo = 'cf'; break;
      case 'ppr': urlAlgo = 'ppr'; break;
      case 'gcn': urlAlgo = 'gcn'; break;
      default: throw new Error(`不支持的算法: ${selectedAlgo}`);
    }
    
    try {
      const backendIdentifier = exampleTypeMapping[exampleName];
      
      const res = await request({
        url: `/part3data/1/${urlAlgo}/${backendIdentifier}/`,
        method: 'GET',
      });
  
      if (res && res.data) {
        const displayContent = res.data.join('\n');
        
        setResults(prev => ({
          ...prev,
          [exampleName]: displayContent
        }));
      }
  
      // 更新按钮显示状态
  // 更新按钮显示状态
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const steps = ['编程接口示例', 'graphIR示例', 'MatrixIR示例', '硬件指令示例'];
      
      // 创建新的按钮状态对象
      const newButtonStates = {};
      steps.forEach((step, index) => {
        // 当前步骤的按钮设置为true，之前的设置为false
        newButtonStates[step] = index === nextStep;
      });

      setShowButtons(newButtonStates);


    } catch (error) {
      console.error('获取示例失败:', error);
      setResults(prev => ({
        ...prev,
        [exampleName]: `获取示例失败: ${error.message}`
      }));
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f6fa' }}>
      {/* 文字说明模块 */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#f0f4f8', border: '1px solid #e0e0e0' }}>
        <Typography variant="body1" component="div" sx={{ lineHeight: 1.6, color: '#2d3436', fontSize: '0.95rem' }}>
          <strong>考核指标：</strong>
          <Box component="span" display="block">建立统一图计算编程模型和编译工具</Box>
          <Box component="span" display="block">动态图更新性能达到每秒百万条边</Box>
          <strong>中期指标：</strong>
          <Box component="span" display="block">指标3.1：抽象出图遍历、图挖掘、图学习所具有的共性计算特征</Box>
          <Box component="span" display="block">指标3.2：使用SNAP标准动态图数据集进行评测，动态图更新速率达到每秒五十万条边</Box>
          <strong>完成时指标：</strong>
          <Box component="span" display="block">指标3.1：提出对图计算、图挖掘、图学习算法统一化表达的编程模型和编译工具</Box>
          <Box component="span" display="block">指标3.2：使用SNAP标准动态图数据集进行评测，动态图更新速率达到每秒百万条边</Box>
          <strong>考核方式：</strong>
          <Box component="span" display="block">首先，将图遍历、图学习、图挖掘应用采用CGA编程模型统一化表达</Box>
          <Box component="span" display="block">然后，将CGA编程模型经过多层编译，转换成图计算加速卡（模拟器）上运行的代码</Box>
          <Box component="span" display="block">最后，支持GraphScope和DGL框架向CGA编程模型的转换</Box>
          <Box component="span" display="block">使用SNAP标准动态图数据集进行评测，性能指标计算方法是：动态图更新速率=总更新边数/总更新时间</Box>
          <strong>数据集来源：</strong>
          <Box component="span" display="block">采用选择SNAP的标准图数据集facebook，和图卷积网络标准数据集Cora</Box>

        </Typography>
      </Paper>

      {/* 运行控制模块和Terminal执行结果并排 */}
      <Grid container spacing={3} mb={2} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 250, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main', borderBottom: '2px solid', borderColor: 'secondary.main', pb: 1 }}>
              运行控制
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 550, fontSize: '16px', mb: 1 }}>
                选择算法
              </Typography>
              <Select
                fullWidth
                value={selectedAlgo}
                onChange={handleAlgoChange}
                disabled={isRunning}
              >
                {algorithms.map((algo) => (
                  <MenuItem key={algo} value={algo}>
                    {algo}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleRun} 
              disabled={isRunning} 
              sx={{ marginBottom: 2 }}
            >
              {isRunning ? '运行中...' : '运行'}
            </Button>
            {isRunning && <LinearProgress value={progress} />}
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 350, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
              Terminal执行结果
            </Typography>
            <Box sx={{
              backgroundColor: '#1e1e1e',
              color: '#4caf50',
              fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              overflow: 'auto',
              padding: '16px',
              borderRadius: '4px',
              flex: 1,
              whiteSpace: 'pre',
              p: 1.5,

              '& > div': {
                color: '#4caf50 !important',
                lineHeight: 1.6,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                py: 0.5
              }
            }} ref={resultsBoxRef}>
                {/* {results['Terminal执行结果'] ? (<div>{`> ${results['Terminal执行结果']}`}</div>) : null} */}
                
                {/* {(typeof results['Terminal执行结果'] === 'string'
                  ? results['Terminal执行结果'].split('\n')
                  : []
                ).map((line, index) => (
                  <div key={index}>{`> ${line}`}</div>
                ))} */}
              <div>{results['Terminal执行结果'] || ''}</div>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 示例展示区域 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 500 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                基于CGA编程模型的代码展示
              </Typography>
              {showButtons['编程接口示例'] && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleShowExample('编程接口示例')}
                >
                  运行
                </Button>
              )}
            </Box>
            <ReadOnlyCodeBox content={results['编程接口示例'] || ''} height={400} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 500 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                GraphIR展示
              </Typography>
              {showButtons['graphIR示例'] && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleShowExample('graphIR示例')}
                >
                  运行
                </Button>
              )}
            </Box>
            <ReadOnlyCodeBox content={results['graphIR示例'] || ''} height={400} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 500 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                MatrixIR展示
              </Typography>
              {showButtons['MatrixIR示例'] && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleShowExample('MatrixIR示例')}
                >
                  运行
                </Button>
              )}
            </Box>
            <ReadOnlyCodeBox content={results['MatrixIR示例'] || ''} height={400} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 500 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                硬件指令展示
              </Typography>
              {showButtons['硬件指令示例'] && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleShowExample('硬件指令示例')}
                >
                  运行
                </Button>
              )}
            </Box>
            <ReadOnlyCodeBox content={results['硬件指令示例'] || ''} height={400} />
          </Paper>
        </Grid>
      </Grid>

      {/* 模拟器执行区域 */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 450, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                在模拟器上执行硬件指令
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSimulatorRun} 
                disabled={isSimulatorRunning}
              >
                {isSimulatorRunning ? '运行中...' : '运行'}
              </Button>
            </Box>
            {isSimulatorRunning && <LinearProgress value={simulatorProgress} sx={{ mb: 2 }} />}
            <Box sx={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              overflow: 'auto',
              padding: '16px',
              borderRadius: '4px',
              flex: 1,
              whiteSpace: 'pre',
            }} ref={simulatorBoxRef}>
              {simulatorResults}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
