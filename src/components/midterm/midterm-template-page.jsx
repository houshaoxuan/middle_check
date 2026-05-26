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

function optionIndex(options, value) {
  const index = options.findIndex((option) => option.key === value || option.label === value);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function buildQuery(params) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  ).toString();

  return query ? `?${query}` : '';
}

function streamRunLog({ apiBasePath, algorithmKey, datasetKey, params = {}, onLog }) {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(
      `${BASE_URL}${apiBasePath}/execute/${algorithmKey}/${datasetKey}/${buildQuery(params)}`
    );

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
  const apiBasePath = (config.apiBasePath || '/midterm/part1').replace(/\/$/, '');
  const controls = config.controls || {};
  const updateScaleControl = config.updateScaleControl || {};
  const updateScaleOptions = React.useMemo(() => updateScaleControl.options || [], [updateScaleControl.options]);
  const leftColumnRef = React.useRef(null);
  const firstAlgorithm = config.algorithms[0];
  const [selectedAlgorithm, setSelectedAlgorithm] = React.useState(firstAlgorithm.key);
  const [selectedDataset, setSelectedDataset] = React.useState(firstAlgorithm.datasets[0].key);
  const [selectedUpdateScale, setSelectedUpdateScale] = React.useState(updateScaleOptions[0]?.key || '');
  const [isRunning, setIsRunning] = React.useState(false);
  const [logs, setLogs] = React.useState([]);
  const [resultRows, setResultRows] = React.useState([]);
  const [leftColumnHeight, setLeftColumnHeight] = React.useState(0);

  const currentAlgorithm = config.algorithms.find((algorithm) => algorithm.key === selectedAlgorithm) || firstAlgorithm;
  const availableDatasets = currentAlgorithm.datasets;

  React.useEffect(() => {
    const element = leftColumnRef.current;
    if (!element) return undefined;

    const updateHeight = () => {
      const nextHeight = Math.ceil(element.getBoundingClientRect().height);
      setLeftColumnHeight((prevHeight) => (Math.abs(prevHeight - nextHeight) < 1 ? prevHeight : nextHeight));
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    if (typeof ResizeObserver === 'undefined') {
      return () => window.removeEventListener('resize', updateHeight);
    }

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const displayRows = React.useMemo(() => {
    return [...resultRows].sort((a, b) => {
      const algorithmOrder =
        optionIndex(config.algorithms, a.algorithmKey ?? a.algorithm) -
        optionIndex(config.algorithms, b.algorithmKey ?? b.algorithm);
      if (algorithmOrder !== 0) return algorithmOrder;

      const datasetOrder =
        optionIndex(availableDatasets, a.datasetKey ?? a.dataset) - optionIndex(availableDatasets, b.datasetKey ?? b.dataset);
      if (datasetOrder !== 0) return datasetOrder;

      const updateScaleOrder =
        optionIndex(updateScaleOptions, a.updateScaleKey ?? a.updateScale) -
        optionIndex(updateScaleOptions, b.updateScaleKey ?? b.updateScale);
      if (updateScaleOrder !== 0) return updateScaleOrder;

      return String(a.id).localeCompare(String(b.id));
    });
  }, [availableDatasets, config.algorithms, resultRows, updateScaleOptions]);

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

  const handleUpdateScaleChange = (event) => {
    setSelectedUpdateScale(event.target.value);
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
    const updateScalesToRun =
      updateScaleOptions.length === 0
        ? [null]
        : selectedUpdateScale === updateScaleControl.allKey
          ? updateScaleOptions.filter((option) => option.key !== updateScaleControl.allKey)
          : updateScaleOptions.filter((option) => option.key === selectedUpdateScale);
    const runCount = Math.max(datasetsToRun.length * updateScalesToRun.length, 1);
    const streamDuration = Math.max(0.9, 6.5 / runCount).toFixed(2);

    try {
      setLogs([`开始执行 ${currentAlgorithm.label} 指标测试...`]);

      for (const dataset of datasetsToRun) {
        for (const updateScale of updateScalesToRun) {
          const requestParams = updateScale ? { scale: updateScale.key } : {};
          const streamParams = { ...requestParams, duration: streamDuration };
          const runKey = [currentAlgorithm.key, dataset.key, updateScale?.key].filter(Boolean).join(':');

          await streamRunLog({
            apiBasePath,
            algorithmKey: currentAlgorithm.key,
            datasetKey: dataset.key,
            params: streamParams,
            onLog: (line) => setLogs((prev) => [...prev, line]),
          });

          const response = await request({
            url: `${apiBasePath}/result/${currentAlgorithm.key}/${dataset.key}/${buildQuery(requestParams)}`,
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
                updateScale: normalizedResult.updateScale ?? updateScale?.label ?? dataset.updateScale,
                algorithmKey: currentAlgorithm.key,
                datasetKey: dataset.key,
                updateScaleKey: updateScale?.key,
                id: runKey,
              },
            ])
          );
          const scaleLabel = updateScale ? ` / ${updateScale.label}` : '';
          setLogs((prev) => [...prev, `✅ ${currentAlgorithm.label} / ${dataset.label}${scaleLabel} 执行完成`]);
        }
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
          <Grid ref={leftColumnRef} container spacing={3}>
            <Grid item xs={12}>
              <RunControl
                algorithms={config.algorithms}
                datasets={availableDatasets}
                isRunning={isRunning}
                selectedAlgorithm={selectedAlgorithm}
                selectedDataset={selectedDataset}
                selectedUpdateScale={selectedUpdateScale}
                onAlgorithmChange={handleAlgorithmChange}
                onDatasetChange={handleDatasetChange}
                onUpdateScaleChange={handleUpdateScaleChange}
                onRun={runProcess}
                allDatasetsKey={config.allDatasetsKey}
                updateScaleOptions={updateScaleOptions}
                showAlgorithmSelect={controls.showAlgorithmSelect !== false}
                showDatasetSelect={controls.showDatasetSelect !== false}
                showUpdateScaleSelect={Boolean(updateScaleControl.enabled)}
                disableDatasetSelect={Boolean(controls.disableDatasetSelect)}
                algorithmLabel={controls.algorithmLabel}
                datasetLabel={controls.datasetLabel}
                updateScaleLabel={updateScaleControl.label}
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
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            display: 'flex',
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              minHeight: 0,
              height: { xs: 'auto', md: leftColumnHeight || 'auto' },
              overflow: 'hidden',
            }}
          >
            <TerminalLog lines={logs} />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {config.codeComparison ? (
          <Grid item xs={12}>
            <CodeComparison config={config.codeComparison} selectedAlgorithm={selectedAlgorithm} />
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <ResultTable columns={config.tableColumns} rows={displayRows} title={config.tableTitle} />
        </Grid>
        <Grid item xs={12}>
          <MetricBarChart
            metrics={config.chart.metrics}
            rows={displayRows}
            title={config.chart.title}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
