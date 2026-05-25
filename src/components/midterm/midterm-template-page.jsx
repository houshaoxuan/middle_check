'use client';

import React from 'react';
import { Box, Grid } from '@mui/material';

import request from '@/lib/request/request';

import MetricBarChart from './metric-bar-chart';
import MetricIntro from './metric-intro';
import ResultTable from './result-table';
import RunControl from './run-control';
import SelectionInfo from './selection-info';
import TerminalLog from './terminal-log';

function upsertRows(rows, incomingRows) {
  const map = new Map(rows.map((row) => [row.id, row]));
  incomingRows.forEach((row) => map.set(row.id, row));
  return Array.from(map.values());
}

function streamRunLog({ apiBasePath, algorithmKey, datasetKey, onLog }) {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(`${request.BASE_URL}${apiBasePath}/execute/${algorithmKey}/${datasetKey}/`);

    eventSource.onmessage = (event) => {
      if (event.data === '[done]') {
        eventSource.close();
        resolve();
        return;
      }

      if (event.data === '[error]') {
        eventSource.close();
        reject(new Error('后端执行出错'));
        return;
      }

      onLog(event.data);
    };

    eventSource.onerror = () => {
      eventSource.close();
      reject(new Error('后端连接失败'));
    };
  });
}

export default function MidtermTemplatePage({ config }) {
  const apiBasePath = (config.apiBasePath || '/part6').replace(/\/$/, '');
  const firstAlgorithm = config.algorithms[0];
  const [selectedAlgorithm, setSelectedAlgorithm] = React.useState(firstAlgorithm.key);
  const [selectedDataset, setSelectedDataset] = React.useState(firstAlgorithm.datasets[0].key);
  const [selectedMetric, setSelectedMetric] = React.useState(config.chart.metrics[0].key);
  const [isRunning, setIsRunning] = React.useState(false);
  const [logs, setLogs] = React.useState([]);
  const [resultRows, setResultRows] = React.useState([]);

  const currentAlgorithm = config.algorithms.find((algorithm) => algorithm.key === selectedAlgorithm) || firstAlgorithm;
  const availableDatasets = currentAlgorithm.datasets;

  const handleAlgorithmChange = (event) => {
    const algorithmKey = event.target.value;
    const algorithm = config.algorithms.find((item) => item.key === algorithmKey);

    setSelectedAlgorithm(algorithmKey);
    setSelectedDataset(algorithm.datasets[0].key);
    setLogs([]);
  };

  const handleDatasetChange = (event) => {
    setSelectedDataset(event.target.value);
    setLogs([]);
  };

  const runProcess = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setLogs([]);

    const datasetsToRun =
      selectedDataset === config.allDatasetsKey
        ? currentAlgorithm.datasets.filter((dataset) => dataset.key !== config.allDatasetsKey)
        : currentAlgorithm.datasets.filter((dataset) => dataset.key === selectedDataset);

    try {
      setLogs([`开始执行 ${currentAlgorithm.label} 指标测试...`]);

      for (const dataset of datasetsToRun) {
        const runKey = `${currentAlgorithm.key}:${dataset.key}`;

        await streamRunLog({
          apiBasePath,
          algorithmKey: currentAlgorithm.key,
          datasetKey: dataset.key,
          onLog: (line) => setLogs((prev) => [...prev, line]),
        });

        const response = await request({
          url: `${apiBasePath}/result/${currentAlgorithm.key}/${dataset.key}/`,
          method: 'GET',
        });
        const result = response.data;
        setResultRows((prev) => upsertRows(prev, [{ ...result, id: runKey }]));
        setLogs((prev) => [...prev, `✅ ${currentAlgorithm.label} / ${dataset.label} 执行完成`]);
      }
    } catch (error) {
      setLogs((prev) => [...prev, `❌ 运行失败: ${error.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f6fa' }}>
      <MetricIntro sections={config.introSections} />

      <Grid container spacing={3} sx={{ mb: 3 }} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <RunControl
                algorithms={config.algorithms}
                datasets={availableDatasets}
                isRunning={isRunning}
                selectedAlgorithm={selectedAlgorithm}
                selectedDataset={selectedDataset}
                onAlgorithmChange={handleAlgorithmChange}
                onDatasetChange={handleDatasetChange}
                onRun={runProcess}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectionInfo
                algorithm={currentAlgorithm}
                datasetKey={selectedDataset}
                allDatasetsKey={config.allDatasetsKey}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={8}>
          <TerminalLog lines={logs} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ResultTable columns={config.tableColumns} rows={resultRows} title={config.tableTitle} />
        </Grid>
        <Grid item xs={12}>
          <MetricBarChart
            metrics={config.chart.metrics}
            rows={resultRows}
            selectedMetric={selectedMetric}
            onMetricChange={(event) => setSelectedMetric(event.target.value)}
            title={config.chart.title}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
