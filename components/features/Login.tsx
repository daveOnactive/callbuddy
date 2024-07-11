'use client'
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import Logo from '../../public/logo.png';
import { useContext } from "react";
import { AuthenticationContext } from "@/providers";

export function Login() {
  const { fastLogin, isCreatingUser } = useContext(AuthenticationContext);

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
        <source src="https://el.phncdn.com/pics/gifs/026/643/752/26643752a.mp4" type="video/mp4" />
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

        <Typography my={2} variant="h6" color='white'>Call Buddy</Typography>

        <Button
          sx={{
            mx: 'auto',
            display: 'flex',
            width: '80%'
          }}
          fullWidth
          size="large"
          variant="contained"
          onClick={fastLogin}
          disabled={isCreatingUser}
        >

          {
            isCreatingUser ? (
              <CircularProgress
                sx={{
                  color: 'white'
                }}
              />
            ) : (
              <BoltRoundedIcon fontSize='large' />
            )
          }
        </Button>
        <Typography color='white' mt={1} variant="body1">Fast Login</Typography>
      </Box>
    </Box>
  )
}