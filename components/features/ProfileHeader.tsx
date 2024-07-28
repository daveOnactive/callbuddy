'use client'
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useContext } from "react";
import { AuthenticationContext } from "@/providers";
import { useRouter } from "next/navigation";

export function ProfileHeader() {
  const { user } = useContext(AuthenticationContext);
  const { push } = useRouter();
  return (
    <Box sx={{
      position: 'relative',
      width: '100%'
    }}>
      <IconButton
        onClick={() => push('/home')}
        sx={{
          position: 'absolute',
          top: '5%',
          left: '5%',
          zIndex: 2
        }}
      >
        <ArrowBackIosNewRoundedIcon sx={{ color: 'white' }} />
      </IconButton>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        justifyContent: 'center',
        alignItems: 'center',
        pt: '5rem'
      }}>
        <Avatar
          src={user?.avatarUrl}
          alt={user?.name}
          sx={{
            width: 70,
            height: 70,
            zIndex: 2,
          }}
        />
        <Typography variant="subtitle1" fontWeight='bold'>{user?.name}</Typography>
      </Box>

      <Box
        sx={({ palette: { background: { paper } } }) => ({
          background: paper,
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '7.5rem',
          zIndex: 1,
        })}
      />
    </Box >
  )
}