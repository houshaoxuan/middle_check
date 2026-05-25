import React from 'react';
import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

function InfoLine({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 0.75 }}>
      <Typography variant="body2" color="text.secondary" sx={{ flex: '0 0 auto' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
        {value || '-'}
      </Typography>
    </Box>
  );
}

function DatasetSummary({ dataset }) {
  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75 }}>
        {dataset.label}
      </Typography>
      <InfoLine label="点规模" value={dataset.nodes} />
      <InfoLine label="边规模" value={dataset.edges} />
      <InfoLine label="数据来源" value={dataset.source} />
      {dataset.description ? (
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mt: 1 }}>
          {dataset.description}
        </Typography>
      ) : null}
    </Box>
  );
}

export default function SelectionInfo({ algorithm, datasetKey, allDatasetsKey }) {
  const isAllDatasets = datasetKey === allDatasetsKey;
  const selectedDatasets = isAllDatasets
    ? algorithm.datasets.filter((dataset) => dataset.key !== allDatasetsKey)
    : algorithm.datasets.filter((dataset) => dataset.key === datasetKey);

  return (
    <Stack spacing={3}>
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
          算法信息
        </Typography>
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {algorithm.label}
          </Typography>
          {algorithm.category ? <Chip label={algorithm.category} size="small" color="primary" sx={{ mt: 1 }} /> : null}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 1.5 }}>
          {algorithm.description}
        </Typography>
        <InfoLine label="中期目标" value={algorithm.midtermTarget} />
        <InfoLine label="考核口径" value={algorithm.evaluation} />
      </Paper>

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
          {isAllDatasets ? '数据集概览' : '数据集信息'}
        </Typography>
        {isAllDatasets ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>名称</TableCell>
                  <TableCell align="right">节点规模</TableCell>
                  <TableCell align="right">边规模</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDatasets.map((dataset) => (
                  <TableRow key={dataset.key}>
                    <TableCell>{dataset.label}</TableCell>
                    <TableCell align="right">{dataset.nodes || '-'}</TableCell>
                    <TableCell align="right">{dataset.edges || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          selectedDatasets.map((dataset, index) => (
            <Box key={dataset.key}>
              {index > 0 ? <Divider sx={{ my: 1 }} /> : null}
              <DatasetSummary dataset={dataset} />
            </Box>
          ))
        )}
      </Paper>
    </Stack>
  );
}
