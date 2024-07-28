'use client'
import { Tab, Tabs as MuiTabs } from '@mui/material';
import { Box } from '@mui/material';
import { pink } from '@mui/material/colors';
import { useState } from 'react';


type IProps = {
  tabs: {
    title: string;
    content: React.ReactNode;
  }[]
}
export function Tabs({ tabs }: IProps) {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box>
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
          backgroundColor: palette.primary.dark,
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
            }, inset 0 1.5px 1px ${palette.primary.dark}, inset 0 -2px 1px ${palette.primary.dark}`,
          '&:focus': {
            color: '#fff',
            outline: `3px solid ${palette.primary.dark}`,
          },
          '&.selected': {
            backgroundColor: '#fff',
            color: palette.primary.dark,
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
            color: palette.primary.dark,
            borderRadius: '8px',
            boxShadow: `0 2px 1px ${palette.mode === "dark"
              ? "rgba(0, 0, 0, 0.5)"
              : "rgba(45, 45, 60, 0.2)"
              }, inset 0 1.5px 1px white, inset 0 -2px 1px white`,
          }
        })}
      >
        {
          tabs.map((tab, index) => (
            <Box component={Tab} key={tab.title} value={index} label={tab.title} />
          ))
        }
      </Box>
      {tabs[value].content}
    </Box>
  );
}
