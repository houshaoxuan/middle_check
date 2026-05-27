import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';

import request from '@/lib/request/request';

function CodePanel({ panel }) {
  const lines = (panel.code || '').split('\n').map((content, index) => ({
    content,
    number: index + 1,
  }));

  return (
    <Grid item xs={12} md={6}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.4 }}>
          {panel.title}
        </Typography>
        <Box
          sx={{
            flex: '1 1 auto',
            maxHeight: 340,
            minHeight: 300,
            overflow: 'auto',
            borderRadius: 1,
            bgcolor: '#f4f6f8',
            border: '1px solid #d9dee7',
            color: '#1f2937',
            fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
            fontSize: '0.8rem',
            lineHeight: 1.6,
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: 'max-content max-content', minWidth: 'max-content' }}>
            {lines.map((line) => (
              <Box key={`${panel.title}-${line.number}`} sx={{ display: 'contents' }}>
                <Box
                  component="span"
                  sx={{
                    px: 1.25,
                    py: 0.15,
                    color: '#7b8494',
                    bgcolor: '#e7ebf0',
                    borderRight: '1px solid #d0d6df',
                    textAlign: 'right',
                    userSelect: 'none',
                  }}
                >
                  {line.number}
                </Box>
                <Box component="span" sx={{ px: 1.5, py: 0.15, whiteSpace: 'pre' }}>
                  {line.content || ' '}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}

export default function CodeComparison({ apiBasePath, config, selectedAlgorithm }) {
  const [remoteConfig, setRemoteConfig] = React.useState(null);

  React.useEffect(() => {
    let isMounted = true;

    if (config?.source !== 'backend' || !apiBasePath || !selectedAlgorithm) {
      setRemoteConfig(null);
      return () => {
        isMounted = false;
      };
    }

    setRemoteConfig(null);

    request({
      url: `${apiBasePath}/code/${selectedAlgorithm}/`,
      method: 'GET',
    })
      .then((response) => {
        if (isMounted) {
          setRemoteConfig(response.data || null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRemoteConfig({ panels: [] });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [apiBasePath, config?.source, selectedAlgorithm]);

  const panels =
    remoteConfig?.panels || config?.byAlgorithm?.[selectedAlgorithm] || config?.panels || [];

  if (!panels.length) return null;

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
        {remoteConfig?.title || config.title || '代码对比展示'}
      </Typography>
      <Grid container spacing={2} alignItems="stretch">
        {panels.map((panel) => (
          <CodePanel key={panel.filename || panel.title} panel={panel} />
        ))}
      </Grid>
    </Paper>
  );
}
