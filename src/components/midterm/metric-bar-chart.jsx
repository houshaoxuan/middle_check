import React from 'react';

import { Box, Paper, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Legend, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';

export default function MetricBarChart({ metrics, rows, title = '性能图表' }) {
  const metric = metrics[0];
  const chartData = rows.map((row) => ({
    dataset: row.dataset || row.algorithm || row.id,
    value: row[metric.valueKey],
    target: row[metric.targetKey],
  }));
  const groupWidth = 120;
  const chartWidth = Math.max(360, chartData.length * groupWidth + 180);
  const barSize = 28;

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {metric.label} - 实测值与中期指标对比，单位：{metric.unit}
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
              height: 330,
              backgroundColor: '#fff',
              border: '1px solid #edf0f3',
              borderRadius: 1,
            }}
          >
            <BarChart
              width={chartWidth}
              height={330}
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              barGap={8}
              barCategoryGap={24}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dataset" />
              <YAxis label={{ value: metric.unit, angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value} ${metric.unit}`, '']} />
              <Legend />
              <ReferenceLine y={metric.defaultTarget} stroke="#ff4444" strokeDasharray="3 3" />
              <Bar dataKey="value" name="实测值" fill="#1976d2" barSize={barSize} />
              <Bar dataKey="target" name="中期指标" fill="#ff7043" barSize={barSize} />
            </BarChart>
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
