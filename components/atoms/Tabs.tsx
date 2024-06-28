'use client'
import { Tab, Tabs as MuiTabs } from '@mui/material';
import { Box } from '@mui/material';
import { pink } from '@mui/material/colors';
import { useState } from 'react';

export function Tabs() {
  const [value, setValue] = useState(1);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box
      component={MuiTabs}
      value={value}
      onChange={handleChange}
      sx={({ palette }) => ({
        fontFamily: "'IBM Plex Sans', sans-serif",
        color: 'white',
        cursor: 'pointer',
        margin: 0,
        fontSize: '0.875rem',
        fontWeight: 'bold',
        backgroundColor: pink[500],
        lineHeight: 1.5,
        padding: '8px 12px',
        minHeight: "100%",
        border: 'none',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        boxShadow: `0 2px 1px ${palette.mode === "dark"
          ? "rgba(0, 0, 0, 0.5)"
          : "rgba(45, 45, 60, 0.2)"
          }, inset 0 1.5px 1px ${pink[400]}, inset 0 -2px 1px ${pink[600]}`,
        '&:focus': {
          color: '#fff',
          outline: `3px solid ${pink[200]}`,
        },
        '&.selected': {
          backgroundColor: '#fff',
          color: pink[600],
        },
        '&.disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        '& .MuiTabs-indicator': {
          background: 'none'
        },
        '& button': {
          textTransform: 'none',
          color: '#fff',
          minHeight: "100%",
          padding: '8px 12px'
        },
        '& .Mui-selected': {
          background: '#fff',
          color: pink[500],
          borderRadius: '8px',
          boxShadow: `0 2px 1px ${palette.mode === "dark"
            ? "rgba(0, 0, 0, 0.5)"
            : "rgba(45, 45, 60, 0.2)"
            }, inset 0 1.5px 1px white, inset 0 -2px 1px white`,
        }
      })}
    >
      <Box component={Tab} value={1} label='Buddies'>

      </Box>
      <Box component={Tab} value={2} label='Rooms'>
        Rooms
      </Box>
      <Box component={Tab} value={3} label='AI Buddy'>
        AI Buddy
      </Box>
    </Box>
  );
}
