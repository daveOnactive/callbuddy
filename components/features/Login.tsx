import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import Logo from '../../public/logo.png';

export function Login() {
  return (
    <Box
      sx={{
        background: 'rgb(244, 143, 177, 50%)',
        height: '100vh',
        width: '100%',
        p: 0,
      }}
    >
      <Box
        component='video'
        muted
        loop
        autoPlay
        controls
        preload="auto"
        playsInline
        sx={{
          position: 'fixed',
          minHeight: '100%',
          minWidth: '100%',
          left: 0,
          top: 0,
          zIndex: -1,
          objectFit: 'contain'
        }}
      >
        <source src="" type="video/mp4" />
      </Box>
      <Box
        sx={{
          width: { md: '20%', xs: '100%' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          mx: 'auto',
          height: "100%"
        }}
      >
        <Image
          src={Logo.src}
          alt='logo'
          width={100}
          height={100}
        />

        <Typography my={2} variant="h6">Jerk Buddy</Typography>

        <Button fullWidth size="large" variant="contained">
          <BoltRoundedIcon fontSize='large' />
        </Button>
        <Typography mt={1} variant="body1">Fast Login</Typography>
      </Box>
    </Box>
  )
}