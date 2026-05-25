import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export default function TerminalLog({ lines, title = 'Terminal 执行结果' }) {
  const terminalRef = React.useRef(null);

  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>
        {title}
      </Typography>
      <Box
        ref={terminalRef}
        sx={{
          flex: '1 1 auto',
          minHeight: 560,
          backgroundColor: '#1e1e1e',
          color: '#4caf50',
          fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          overflow: 'auto',
          padding: '16px',
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
        }}
      >
        {lines.length > 0 ? lines.join('\n') : '> 等待运行...'}
      </Box>
    </Paper>
  );
}
