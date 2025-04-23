"use client";
import React, { useState } from 'react';
import {
  Box, Grid, Button, Select, MenuItem,
  Paper, Typography, LinearProgress
} from '@mui/material';
import ReadOnlyCodeBox from './CodeContainer'; // 确保路径正确

const algorithms = ['算法A', '算法B', '算法C'];

export default function Page() {
  const [selectedAlgo, setSelectedAlgo] = useState(algorithms[0]);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAlgoChange = (event) => {
    setSelectedAlgo(event.target.value);
    setStep(0);
    setResults({});
    setProgress(0);
  };

  const handleRunStep = async () => {
    if (isRunning) {
      return;
    }

    setIsRunning(true);
    setProgress(0);

    await new Promise(resolve => setTimeout(resolve, 1000));

    let newResults = { ...results };
    if (step === 0) {
      newResults['编程接口示例'] = `// 模拟编程接口代码片段 (异步加载)
function processData(input) {
  const result = input.map(item => item * 2);
  return result;
}`;
    } else if (step === 1) {
      newResults['graphIR示例'] = `// 模拟 GraphIR (异步加载)
Graph: {
  nodes: [1, 2, 3],
  edges: [(1, 2), (2, 3)]
}`;
    } else if (step === 2) {
      newResults['MatrixIR示例'] = `// 模拟 MatrixIR (异步加载)
Matrix A: [[1, 2], [3, 4]]
Matrix B: [[5, 6], [7, 8]]`;
    } else if (step === 3) {
      newResults['Register allocate 代码展示'] = `// 模拟寄存器分配代码 (异步加载)
R1 <- Load(Memory[0x1000])
R2 <- Add(R1, 5)
Store(Memory[0x1004], R2)`;
    } else if (step === 4) {
      newResults['硬件指令示例'] = `// 模拟硬件指令 (异步加载)
ADD R1, R2, R3  // R1 = R2 + R3
MUL R4, R5, R6  // R4 = R5 * R6
STORE R7, 0x2000`;
    } else if (step === 5) {
      newResults['Terminal执行结果'] = `
> Program started (异步加载)
> Loading data...
> Processing...
> Result: [2, 4, 6, 8]
> Program finished`;
    }
    setResults(newResults);
    setStep(prevStep => prevStep + 1);
    setIsRunning(false);
    setProgress(100);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f6fa' }}>
      {/* 文字说明模块 */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#f0f4f8', border: '1px solid #e0e0e0' }}>
        <Typography variant="body1" component="div" sx={{ lineHeight: 1.6, color: '#2d3436', fontSize: '0.95rem' }}>
          <strong>模拟文字说明</strong>
          <Box component="span" display="block">这里将展示关于算法流程或实验目的的文字说明。</Box>
          <Box component="span" display="block">您可以根据需要修改这段文字。</Box>
        </Typography>
      </Paper>

      {/* 运行控制模块单独一行 */}
      <Grid container spacing={3} mb={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
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
            <Button variant="contained" color="primary" onClick={handleRunStep} disabled={isRunning || step > 5} sx={{ marginBottom: 2 }}>
              {isRunning ? '运行中...' : (step > 5 ? '运行完成' : '运行')}
            </Button>
            {isRunning && <LinearProgress value={progress} />}
          </Paper>
        </Grid>
      </Grid>

      {/* 其余示例和展示模块 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 500 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
              编程接口示例 {step > 0 ? `(步骤 ${1})` : ''}
            </Typography>
            <ReadOnlyCodeBox content={results['编程接口示例'] || ''} height={400} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 500 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
              graphIR示例 {step > 1 ? `(步骤 ${2})` : ''}
            </Typography>
            <ReadOnlyCodeBox content={results['graphIR示例'] || ''} height={400} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 500 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
              MatrixIR示例 {step > 2 ? `(步骤 ${3})` : ''}
            </Typography>
            <ReadOnlyCodeBox content={results['MatrixIR示例'] || ''} height={400} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 500 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
              Register allocate 代码展示 {step > 3 ? `(步骤 ${4})` : ''}
            </Typography>
            <ReadOnlyCodeBox content={results['Register allocate 代码展示'] || ''} height={400} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 500 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
              硬件指令示例 {step > 4 ? `(步骤 ${5})` : ''}
            </Typography>
            <ReadOnlyCodeBox content={results['硬件指令示例'] || ''} height={400} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 500 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
              Terminal执行结果 {step > 5 ? `(步骤 ${6})` : ''}
            </Typography>
            <Box sx={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              overflow: 'auto',
              padding: '16px',
              borderRadius: '4px',
              height: '400px',
              whiteSpace: 'pre',
            }}>
              {results['Terminal执行结果'] || ''}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
