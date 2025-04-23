"use client";
import React, { useState } from 'react';
import {
  Box, Grid, Button, Select, MenuItem,
  Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress
} from '@mui/material';
import ReadOnlyCodeBox from '../../part2/sub1/CodeContainer'; // 确保路径正确

const datasets = {
  '数据集1': '这是数据集1的详细说明。',
  '数据集2': '这是数据集2的详细说明，包含更多信息。',
  '数据集3': '数据集3 具有不同的特性。',
  '数据集4': '关于数据集4 的一些关键点。',
  '数据集5': '数据集5 的简要说明。',
};

const datasetDetails = [
  { name: '数据集1', size: '100MB', format: 'CSV', description: '包含用户行为数据。' },
  { name: '数据集2', size: '50MB', format: 'JSON', description: '包含社交网络数据。' },
  { name: '数据集3', size: '200MB', format: 'CSV', description: '包含传感器数据。' },
  { name: '数据集4', size: '75MB', format: 'JSON', description: '包含地理位置数据。' },
  { name: '数据集5', size: '120MB', format: 'CSV', description: '包含交易数据。' },
];

const processingResults = {
  '数据集1': '> 加载数据集1...\n> 处理完成，生成了分析结果。\n> 结果摘要：...',
  '数据集2': '> 加载数据集2...\n> 数据转换...\n> 分析完成。\n> 关键指标：...',
  '数据集3': '> 加载数据集3...\n> 数据清洗...\n> 模型训练...\n> 性能评估：...',
  '数据集4': '> 加载数据集4...\n> 地理编码...\n> 可视化生成...',
  '数据集5': '> 加载数据集5...\n> 异常检测...\n> 报告生成...',
};

const initialChartData = [0, 0, 0, 0, 0];

function generateRandomChartData() {
  return [
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 100),
  ];
}

export default function DataProcessingPage() {
  const [selectedDataset, setSelectedDataset] = useState(Object.keys(datasets)[0]);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [chartData, setChartData] = useState(initialChartData);

  const handleDatasetChange = (event) => {
    setSelectedDataset(event.target.value);
  };

  const handleRun = async () => {
    if (isRunning) {
      return;
    }

    setIsRunning(true);
    setTerminalOutput('> 开始处理 ' + selectedDataset + '...\n');
    setChartData(initialChartData); // 重置图表数据

    // 模拟异步数据处理和图表数据获取
    await new Promise(resolve => setTimeout(resolve, 1500));

    setTerminalOutput(processingResults[selectedDataset] || '> 未找到该数据集的处理结果。');

    // 模拟异步获取柱状图数据
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newChartData = generateRandomChartData();
    setChartData(newChartData);

    setIsRunning(false);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f6fa' }}>
      {/* 顶部文字说明模块 */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#f0f4f8', border: '1px solid #e0e0e0' }}>
        <Typography variant="body1" component="div" sx={{ lineHeight: 1.6, color: '#2d3436', fontSize: '0.95rem' }}>
          <strong>数据处理与性能展示</strong>
          <Box component="span" display="block">请选择一个数据集，然后点击运行以查看模拟的终端执行结果和性能图表。</Box>
          <Box component="span" display="block">页面底部将展示每秒动态图更新边数量的模拟柱状图。</Box>
        </Typography>
      </Paper>

      {/* 数据集说明表格 */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
          数据集说明 (表格)
        </Typography>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="数据集说明">
            <TableHead>
              <TableRow>
                <TableCell>名称</TableCell>
                <TableCell align="right">大小</TableCell>
                <TableCell align="right">格式</TableCell>
                <TableCell>描述</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datasetDetails.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.size}</TableCell>
                  <TableCell align="right">{row.format}</TableCell>
                  <TableCell>{row.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
            选择数据集
          </Typography>
          <Select
            fullWidth
            value={selectedDataset}
            onChange={handleDatasetChange}
          >
            {Object.keys(datasets).map((dataset) => (
              <MenuItem key={dataset} value={dataset}>
                {dataset}
              </MenuItem>
            ))}
          </Select>
            </Box>
            <Button variant="contained" color="primary" onClick={handleRun} disabled={isRunning}>
            {isRunning ? '运行中...' : '运行'}
          </Button>
            {isRunning && <LinearProgress value={progress} />}
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          {/* Terminal 执行结果 */}
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main'}}>
              Terminal 执行结果
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
              {terminalOutput || ''}
            </Box>
          </Paper>
        </Grid>
      </Grid>



      {/* 性能展示 - 每秒动态图更新边数量（柱状图） */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 3, minHeight: 200 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
          性能展示 - 每秒动态图更新边数量（模拟柱状图）
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 150, bgcolor: '#f0f0f0', borderRadius: '4px', p: 2 }}>
          {chartData.map((value, index) => (
            <Box
              key={index}
              sx={{
                width: '20px',
                bgcolor: 'primary.main',
                height: `${value}px`,
                marginRight: '5px',
                borderRadius: '4px 4px 0 0',
              }}
              title={`边数量: ${value}`}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
          {chartData.map((_, index) => (
            <Typography key={index} variant="caption">{`时间${index + 1}s`}</Typography>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
