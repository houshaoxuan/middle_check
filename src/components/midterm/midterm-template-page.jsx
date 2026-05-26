'use client';

import React from 'react';
import { Box, Grid } from '@mui/material';

import request, { BASE_URL } from '@/lib/request/request';

import CodeComparison from './code-comparison';
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
    const eventSource = new EventSource(`${BASE_URL}${apiBasePath}/execute/${algorithmKey}/${datasetKey}/`);

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
  const apiBasePath = (config.apiBasePath || '/midterm/part2').replace(/\/$/, '');
  const controls = config.controls || {};
  const firstAlgorithm = config.algorithms[0];
  const [selectedAlgorithm, setSelectedAlgorithm] = React.useState(firstAlgorithm.key);
  const [selectedDataset, setSelectedDataset] = React.useState(firstAlgorithm.datasets[0].key);
  const [isRunning, setIsRunning] = React.useState(false);
  const [logs, setLogs] = React.useState([]);
  const [resultRows, setResultRows] = React.useState([]);

  const currentAlgorithm = config.algorithms.find((algorithm) => algorithm.key === selectedAlgorithm) || firstAlgorithm;
  const availableDatasets = currentAlgorithm.datasets;

  const handleAlgorithmChange = (event) => {
    const algorithmKey = event.target.value;
    const algorithm = config.algorithms.find((item) => item.key === algorithmKey);

    setSelectedAlgorithm(algorithmKey);
    setSelectedDataset(algorithm?.datasets?.[0]?.key);
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
        const normalizedResult = config.chart.metrics.reduce(
          (acc, metric) =>
            metric.midtermTarget === undefined || !metric.targetKey
              ? acc
              : { ...acc, [metric.targetKey]: metric.midtermTarget },
          result
        );
        setResultRows((prev) =>
          upsertRows(prev, [
            {
              ...normalizedResult,
              vertices: normalizedResult.vertices ?? dataset.nodes,
              edges: normalizedResult.edges ?? dataset.edges,
              updateScale: normalizedResult.updateScale ?? dataset.updateScale,
              id: runKey,
            },
          ])
        );
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
                allDatasetsKey={config.allDatasetsKey}
                showAlgorithmSelect={controls.showAlgorithmSelect !== false}
                showDatasetSelect={controls.showDatasetSelect !== false}
                disableDatasetSelect={Boolean(controls.disableDatasetSelect)}
                algorithmLabel={controls.algorithmLabel}
                datasetLabel={controls.datasetLabel}
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
        {config.codeComparison ? (
          <Grid item xs={12}>
            <CodeComparison config={config.codeComparison} selectedAlgorithm={selectedAlgorithm} />
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <ResultTable columns={config.tableColumns} rows={resultRows} title={config.tableTitle} />
        </Grid>
        <Grid item xs={12}>
          <MetricBarChart
            metrics={config.chart.metrics}
            rows={resultRows}
            title={config.chart.title}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
