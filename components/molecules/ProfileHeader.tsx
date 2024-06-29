import { Avatar, Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { pink } from "@mui/material/colors";

export function ProfileHeader() {
  return (
    <Box sx={{
      position: 'relative',
      width: '100%'
    }}>
      <IconButton
        sx={{
          position: 'absolute',
          top: '5%',
          left: '5%',
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
          src="https://img.freepik.com/premium-photo/graphic-designer-digital-avatar-generative-ai_934475-9292.jpg"
          alt='Remmy'
          sx={{
            width: 70,
            height: 70
          }}
        />
        <Typography variant="subtitle1" fontWeight='bold'>Mark Smith</Typography>
        <Typography variant="subtitle1">Expert</Typography>
      </Box>

      <Box
        sx={{
          background: pink[500],
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '7.5rem',
          zIndex: -1,
        }}
      />
    </Box>
  )
}