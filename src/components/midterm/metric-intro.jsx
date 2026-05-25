import { Box, Paper, Typography } from '@mui/material';

function renderText(item) {
  if (typeof item === 'string') {
    return item;
  }

  return item.parts.map((part, index) => (
    <Box key={`${part.text}-${index}`} component="span" className={part.highlight ? 'red-bold' : undefined}>
      {part.text}
    </Box>
  ));
}

export default function MetricIntro({ sections }) {
  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#f0f4f8', border: '1px solid #e0e0e0' }}>
      <Typography
        variant="body1"
        component="div"
        sx={{
          lineHeight: 1.6,
          color: '#2d3436',
          fontSize: '0.95rem',
          '& .red-bold': {
            fontWeight: 600,
            color: '#ff4444',
            display: 'inline',
            padding: '0 2px',
          },
          '& strong': {
            fontWeight: 600,
          },
        }}
      >
        {sections.map((section) => (
          <Box key={section.title} sx={{ mb: 1 }}>
            <strong style={{ fontSize: '16px' }}>{section.title}</strong>
            {section.items.map((item) => (
              <Box key={typeof item === 'string' ? item : item.parts.map((part) => part.text).join('')} component="span" display="block">
                {renderText(item)}
              </Box>
            ))}
          </Box>
        ))}
      </Typography>
    </Paper>
  );
}
