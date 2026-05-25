import React from 'react';

import { Box, Paper, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';

export default function MetricBarChart({ metrics, rows, title = '性能图表' }) {
  const metric = metrics[0];
  const chartData = rows.map((row) => ({
    dataset: row.dataset || row.algorithm || row.id,
    value: row[metric.valueKey],
    target: row[metric.targetKey],
  }));
  const groupWidth = 120;
  const chartWidth = Math.max(360, chartData.length * groupWidth + 180);
  const chartHeight = 330;
  const chartMargin = { top: 20, right: 30, left: 14, bottom: 44 };
  const yAxisWidth = 66;
  const xAxisHeight = 34;
  const plotLeft = chartMargin.left + yAxisWidth;
  const plotWidth = chartWidth - plotLeft - chartMargin.right;
  const plotHeight = chartHeight - chartMargin.top - chartMargin.bottom - xAxisHeight;
  const axisTitleTop = chartMargin.top + plotHeight / 2;
  const axisTitleLeft = chartMargin.left + 24;
  const barSize = 28;
  const legendItems = [
    { label: '实测值', color: '#1976d2' },
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
        <Box
          sx={{
            width: '100%',
            overflowX: chartWidth > 760 ? 'auto' : 'hidden',
            overflowY: 'hidden',
            pb: 1,
            display: 'flex',
            justifyContent: chartWidth > 760 ? 'flex-start' : 'center',
          }}
        >
          <Box
            sx={{
              width: chartWidth,
              height: chartHeight,
              position: 'relative',
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
              <YAxis width={yAxisWidth} />
              <Tooltip formatter={(value) => [`${value} ${metric.unit}`, '']} />
              <ReferenceLine y={metric.defaultTarget} stroke="#ff4444" strokeDasharray="3 3" />
              <Bar dataKey="value" name="实测值" fill="#1976d2" barSize={barSize} />
              <Bar dataKey="target" name="中期指标" fill="#ff7043" barSize={barSize} />
            </BarChart>
            <Box
              sx={{
                position: 'absolute',
                left: plotLeft,
                bottom: 8,
                width: plotWidth,
                display: 'flex',
                justifyContent: 'center',
                gap: 3,
                pointerEvents: 'none',
              }}
            >
              {legendItems.map((item) => (
                <Box key={item.label} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 15, height: 15, borderRadius: 0.5, backgroundColor: item.color }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, lineHeight: 1 }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
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
