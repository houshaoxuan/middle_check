import React from 'react';

import { Box, Paper, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';

function formatMetricValue(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(2) : value;
}

export default function MetricBarChart({ metrics, rows, title = '性能图表' }) {
  const metric = metrics[0];
  const assessmentTarget = metric.assessmentTarget ?? metric.defaultTarget;
  const midtermTarget = metric.midtermTarget;
  const chartData = rows.map((row) => ({
    dataset: row.updateScale
      ? `${row.dataset || row.algorithm || row.id} / ${row.updateScale}`
      : row.dataset || row.algorithm || row.id,
    assessment: assessmentTarget,
    value: row[metric.valueKey],
    target: midtermTarget ?? row[metric.targetKey],
  }));
  const referenceTarget = midtermTarget ?? chartData.find((item) => typeof item.target === 'number')?.target;
  const groupWidth = 120;
  const chartWidth = Math.max(400, chartData.length * groupWidth + 220);
  const chartHeight = 330;
  const chartMargin = { top: 20, right: 30, left: 44, bottom: 44 };
  const yAxisWidth = 78;
  const xAxisHeight = 34;
  const plotLeft = chartMargin.left + yAxisWidth;
  const plotWidth = chartWidth - plotLeft - chartMargin.right;
  const plotHeight = chartHeight - chartMargin.top - chartMargin.bottom - xAxisHeight;
  const axisTitleTop = chartMargin.top + plotHeight / 2;
  const axisTitleLeft = 52;
  const barSize = 28;
  const legendItems = [
    { label: '考核指标', color: '#7e57c2' },
    { label: '中期完成值', color: '#1976d2' },
    { label: '中期指标', color: '#ff7043' },
  ];

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
          {title}
        </Typography>
      </Box>

      {rows.length > 0 ? (
        <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', pb: 1 }}>
          <Box sx={{ width: '100%', minWidth: chartWidth, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: chartWidth,
                height: chartHeight,
                position: 'relative',
                flex: '0 0 auto',
                backgroundColor: '#fff',
                border: '1px solid #edf0f3',
                borderRadius: 1,
              }}
            >
              <Box
                component="span"
                sx={{
                  position: 'absolute',
                  top: axisTitleTop,
                  left: axisTitleLeft,
                  zIndex: 1,
                  color: '#666',
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: 1,
                  pointerEvents: 'none',
                  transform: 'translate(-50%, -50%) rotate(-90deg)',
                  transformOrigin: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {metric.label}（{metric.unit}）
              </Box>
              <BarChart
                width={chartWidth}
                height={chartHeight}
                data={chartData}
                margin={chartMargin}
                barGap={8}
                barCategoryGap={24}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dataset" height={xAxisHeight} />
                <YAxis width={yAxisWidth} tickFormatter={formatMetricValue} />
                <Tooltip formatter={(value) => [`${formatMetricValue(value)} ${metric.unit}`, '']} />
                <Bar dataKey="assessment" name="考核指标" fill="#7e57c2" barSize={barSize} />
                <Bar dataKey="value" name="中期完成值" fill="#1976d2" barSize={barSize} />
                <Bar dataKey="target" name="中期指标" fill="#ff7043" barSize={barSize} />
                {typeof referenceTarget === 'number' ? (
                  <ReferenceLine y={referenceTarget} stroke="#d32f2f" strokeDasharray="6 4" strokeWidth={2} />
                ) : null}
              </BarChart>
              <Box
                sx={{
                  position: 'absolute',
                  left: plotLeft + plotWidth / 2,
                  bottom: 22,
                  width: 'max-content',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 3,
                  flexWrap: 'nowrap',
                  pointerEvents: 'none',
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap',
                }}
              >
                {legendItems.map((item) => (
                  <Box
                    key={item.label}
                    sx={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, gap: 0.75 }}
                  >
                    <Box
                      sx={{ width: 15, height: 15, flexShrink: 0, borderRadius: 0.5, backgroundColor: item.color }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        flexShrink: 0,
                        fontWeight: 600,
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{ height: 330, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}
        >
          暂无图表数据
        </Box>
      )}
    </Paper>
  );
}
