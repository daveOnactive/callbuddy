'use client'
import { Avatar, Box, Button, Card, Typography } from "@mui/material";
import { grey, pink, yellow } from "@mui/material/colors";
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import Face6RoundedIcon from '@mui/icons-material/Face6Rounded';
import AddIcCallRoundedIcon from '@mui/icons-material/AddIcCallRounded';
import { useRouter } from "next/navigation";

export function BuddyCard() {
  const { push } = useRouter();

  return (
    <Card
      sx={(theme) => ({
        width: "100%",
        background: theme.palette.mode === 'dark' ? grey[900] : '#f7f3f3',
        border: `1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]}`,
        borderRadius: '8px',
        boxShadow: 'none',
        position: 'relative'
      })}
    >
      <Box sx={(theme) => ({
        width: 28,
        height: 28,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1,
        background: 'white',
        '&::after': {
          content: "''",
          width: 8,
          height: 8,
          background: yellow[600],
          display: 'block',
          position: 'relative',
          borderRadius: 100,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: `1px solid ${yellow[500]}`,
          boxShadow: `0 2px 1px ${theme.palette.mode === "dark"
            ? "rgba(0, 0, 0, 0.5)"
            : "rgba(45, 45, 60, 0.2)"
            }, inset 0 1.5px 1px ${yellow[400]}, inset 0 -2px 1px ${yellow[600]}`,
        }
      })}>
      </Box>
      <Box
        sx={{
          background: pink[500],
          p: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Avatar src="https://img.freepik.com/premium-photo/graphic-designer-digital-avatar-generative-ai_934475-9292.jpg" alt='Remmy' />
      </Box>
      <Box p={1}>
        <Typography
          color='black'
          variant="body2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: .1
          }}
        >
          <Face6RoundedIcon color='primary' />
          <span>Smith Mark</span>
        </Typography>
        <Typography
          color='black'
          variant="body2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: .1
          }}
        >
          <StarOutlineRoundedIcon color='primary' />
          <span>Master</span>
        </Typography>

        <Box sx={{
          display: 'flex',
          justifyContent: 'end',
          width: '100%',
          mt: 1
        }}>
          <Button
            size='small'
            variant="contained"
            onClick={() => {
              push('incall?joinCallId=kfnrnginrignring');
            }}
          >
            <AddIcCallRoundedIcon fontSize="small" />
          </Button>
        </Box>
      </Box>
    </Card>
  )
}