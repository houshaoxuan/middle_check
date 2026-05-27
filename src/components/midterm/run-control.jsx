import React from 'react';
import { Box, Button, LinearProgress, MenuItem, Paper, Select, Typography } from '@mui/material';

import { getDatasetDisplayName } from './dataset-utils';

export default function RunControl({
  algorithms,
  datasets,
  isRunning,
  selectedAlgorithm,
  selectedDataset,
  selectedUpdateScale,
  onAlgorithmChange,
  onDatasetChange,
  onUpdateScaleChange,
  onRun,
  allDatasetsKey,
  updateScaleOptions = [],
  showAlgorithmSelect = true,
  showDatasetSelect = true,
  showUpdateScaleSelect = false,
  disableDatasetSelect = false,
  algorithmLabel = '选择算法',
  datasetLabel = '选择数据集',
  updateScaleLabel = '图更新规模',
}) {
  const datasetOptions =
    allDatasetsKey && datasets.length > 1 && !disableDatasetSelect
      ? [...datasets, { key: allDatasetsKey, displayName: '全部数据集' }]
      : datasets;

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: '100%' }}>
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
        运行控制
      </Typography>

      {showAlgorithmSelect ? (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 550, fontSize: '16px', mb: 1 }}>
            {algorithmLabel}
          </Typography>
          <Select fullWidth value={selectedAlgorithm} onChange={onAlgorithmChange} disabled={isRunning} size="small">
            {algorithms.map((algorithm) => (
              <MenuItem key={algorithm.key} value={algorithm.key}>
                {algorithm.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      ) : null}

      {showDatasetSelect ? (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 550, fontSize: '16px', mb: 1 }}>
            {datasetLabel}
          </Typography>
          <Select
            fullWidth
            value={selectedDataset}
            onChange={onDatasetChange}
            disabled={isRunning || disableDatasetSelect}
            size="small"
          >
            {datasetOptions.map((dataset) => (
              <MenuItem key={dataset.key} value={dataset.key}>
                {getDatasetDisplayName(dataset)}
              </MenuItem>
            ))}
          </Select>
        </Box>
      ) : null}

      {showUpdateScaleSelect ? (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 550, fontSize: '16px', mb: 1 }}>
            {updateScaleLabel}
          </Typography>
          <Select
            fullWidth
            value={selectedUpdateScale}
            onChange={onUpdateScaleChange}
            disabled={isRunning}
            size="small"
          >
            {updateScaleOptions.map((option) => (
              <MenuItem key={option.key} value={option.key}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      ) : null}

      <Button fullWidth variant="contained" color="success" onClick={onRun} disabled={isRunning} sx={{ py: 1.2 }}>
        {isRunning ? '运行中...' : '开始运行'}
      </Button>

      {isRunning ? (
        <Box sx={{ mt: 2 }}>
          <LinearProgress color="success" />
        </Box>
      ) : null}
    </Paper>
  );
}
