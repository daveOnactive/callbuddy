'use client'
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import Face5RoundedIcon from '@mui/icons-material/Face5Rounded';
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded';
import { useRouter } from "next/navigation";
import { StartCall } from "../features";

export function BottomBar() {
  const { push } = useRouter();

  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{
        top: 'auto',
        bottom: '3%',
        width: '90%',
        borderRadius: '10px',
        left: '50%',
        transform: 'translateX(-50%)'
      }}
    >
      <Toolbar>
        <IconButton
          disabled
          sx={{
            marginLeft: '3rem'
          }}
          color="inherit"
          aria-label="open drawer">
          <MailOutlinedIcon />
        </IconButton>
        <StartCall />
        <Box sx={{ flexGrow: 1 }} />
        <IconButton sx={{
          marginRight: '3rem'
        }}
          color="inherit"
          onClick={() => push('/profile')}
        >
          <Face5RoundedIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}