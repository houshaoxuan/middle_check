"use client";
import React, { useState } from 'react';
import {
  Box, Grid, Button, Select, MenuItem,
  Paper, Typography, LinearProgress
} from '@mui/material';
import ReadOnlyCodeBox from '../../part2/sub1/CodeContainer'; // 确保路径正确

const frameworks = {
  '框架A': ['算法A1', '算法A2'],
  '框架B': ['算法B1', '算法B2', '算法B3'],
};

const originalCode = {
  '算法A1': '// 框架A 算法A1 的原始代码',
  '算法A2': '// 框架A 算法A2 的原始代码',
  '算法B1': '// 框架B 算法B1 的原始代码',
  '算法B2': '// 框架B 算法B2 的原始代码',
  '算法B3': '// 框架B 算法B3 的原始代码',
};

const transformedCodeStep1 = {
  '算法A1': '// 框架A1 转换后的代码 (步骤 1)',
  '算法A2': '// 框架A2 转换后的代码 (步骤 1)',
  '算法B1': '// 框架B1 转换后的代码 (步骤 1)',
  '算法B2': '// 框架B2 转换后的代码 (步骤 1)',
  '算法B3': '// 框架B3 转换后的代码 (步骤 1)',
};

const resultsStep2 = {
  '算法A1': {
    graphIR示例: '// 算法A1 的 graphIR 示例',
    MatrixIR示例: '// 算法A1 的 MatrixIR 示例',
    'Register allocate 代码展示': '// 算法A1 的 Register allocate 代码展示',
    '硬件指令示例': '// 算法A1 的 硬件指令示例',
    'Terminal执行结果': '// 算法A1 的 Terminal 执行结果',
  },
  '算法A2': {
    graphIR示例: '// 算法A2 的 graphIR 示例',
    MatrixIR示例: '// 算法A2 的 MatrixIR 示例',
    'Register allocate 代码展示': '// 算法A2 的 Register allocate 代码展示',
    '硬件指令示例': '// 算法A2 的 硬件指令示例',
    'Terminal执行结果': '// 算法A2 的 Terminal 执行结果',
  },
  '算法B1': {
    graphIR示例: '// 算法B1 的 graphIR 示例',
    MatrixIR示例: '// 算法B1 的 MatrixIR 示例',
    'Register allocate 代码展示': '// 算法B1 的 Register allocate 代码展示',
    '硬件指令示例': '// 算法B1 的 硬件指令示例',
    'Terminal执行结果': '// 算法B1 的 Terminal 执行结果',
  },
  '算法B2': {
    graphIR示例: '// 算法B2 的 graphIR 示例',
    MatrixIR示例: '// 算法B2 的 MatrixIR 示例',
    'Register allocate 代码展示': '// 算法B2 的 Register allocate 代码展示',
    '硬件指令示例': '// 算法B2 的 硬件指令示例',
    'Terminal执行结果': '// 算法B2 的 Terminal 执行结果',
  },
  '算法B3': {
    graphIR示例: '// 算法B3 的 graphIR 示例',
    MatrixIR示例: '// 算法B3 的 MatrixIR 示例',
    'Register allocate 代码展示': '// 算法B3 的 Register allocate 代码展示',
    '硬件指令示例': '// 算法B3 的 硬件指令示例',
    'Terminal执行结果': '// 算法B3 的 Terminal 执行结果',
  },
};

export default function FrameworkConversionPage() {
  const [selectedFramework, setSelectedFramework] = useState(Object.keys(frameworks)[0]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(frameworks[Object.keys(frameworks)[0]][0]);
  const [originalCodeDisplay, setOriginalCodeDisplay] = useState(originalCode[frameworks[Object.keys(frameworks)[0]][0]] || '');
  const [transformedCode, setTransformedCode] = useState('');
  const [step, setStep] = useState(0);
  const [results, setResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFrameworkChange = (event) => {
    const framework = event.target.value;
    setSelectedFramework(framework);
    setSelectedAlgorithm(frameworks[framework][0]);
    setOriginalCodeDisplay(originalCode[frameworks[framework][0]] || '');
    setTransformedCode('');
    setStep(0);
    setResults({});
  };

  const handleAlgorithmChange = (event) => {
    const algorithm = event.target.value;
    setSelectedAlgorithm(algorithm);
    setOriginalCodeDisplay(originalCode[algorithm] || '');
    setTransformedCode('');
    setStep(0);
    setResults({});
  };

  const handleRun = async () => {
    if (isRunning) {
      return;
    }

    setIsRunning(true);
    setProgress(0);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (step === 0) {
      setTransformedCode(transformedCodeStep1[selectedAlgorithm] || '// 转换后的代码');
      setStep(1);
    } else if (step === 1) {
      setResults(resultsStep2[selectedAlgorithm] || {});
      setStep(2);
    }

    setIsRunning(false);
    setProgress(100);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f6fa' }}>
      {/* 顶部文字说明模块 */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#f0f4f8', border: '1px solid #e0e0e0' }}>
        <Typography variant="body1" component="div" sx={{ lineHeight: 1.6, color: '#2d3436', fontSize: '0.95rem' }}>
          <strong>框架转换</strong>
          <Box component="span" display="block">请选择原始框架和目标框架下的算法，然后点击运行进行代码转换和结果展示。</Box>
          <Box component="span" display="block">第一次点击“运行”将显示转换后的代码，再次点击将显示后续步骤的结果。</Box>
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
            选择框架
          </Typography>
          <Select
            fullWidth
            value={selectedFramework}
            onChange={handleFrameworkChange}
          >
            {Object.keys(frameworks).map((framework) => (
              <MenuItem key={framework} value={framework}>
                {framework}
              </MenuItem>
            ))}
          </Select>
            </Box>
            <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 550, fontSize: '16px', mb: 1 }}>
            选择算法
          </Typography>
          <Select
            fullWidth
            value={selectedAlgorithm}
            onChange={handleAlgorithmChange}
            disabled={!selectedFramework}
          >
            {frameworks[selectedFramework]?.map((algorithm) => (
              <MenuItem key={algorithm} value={algorithm}>
                {algorithm}
              </MenuItem>
            ))}
          </Select>
            </Box>
            <Button variant="contained" color="primary" onClick={handleRun} disabled={isRunning} sx={{ marginBottom: 2 }}>
              {isRunning ? '运行中...' : '运行'}
            </Button>
            {isRunning && <LinearProgress value={progress} />}
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {/* 原框架代码 */}
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, mb: 3, height: 300 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
              原框架代码
            </Typography>
            <ReadOnlyCodeBox content={originalCodeDisplay} height={200} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          {/* 现框架代码（步骤 ①） */}
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, mb: 3, height: 300 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
              现框架代码 (步骤 ①)
            </Typography>
            <ReadOnlyCodeBox content={transformedCode} height={200} />
          </Paper>
        </Grid>
      </Grid>
      {/* 结果展示（步骤 ②） */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 250 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
              graphIR示例 (步骤 ②)
            </Typography>
            <ReadOnlyCodeBox content={results['graphIR示例'] || ''} height={150} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 250 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
              MatrixIR示例 (步骤 ②)
            </Typography>
            <ReadOnlyCodeBox content={results['MatrixIR示例'] || ''} height={150} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 250 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
              Register allocate 代码展示 (步骤 ②)
            </Typography>
            <ReadOnlyCodeBox content={results['Register allocate 代码展示'] || ''} height={150} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 250 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
              硬件指令示例 (步骤 ②)
            </Typography>
            <ReadOnlyCodeBox content={results['硬件指令示例'] || ''} height={150} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: 250 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
              Terminal执行结果 (步骤 ②)
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
              height: '150px',
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
