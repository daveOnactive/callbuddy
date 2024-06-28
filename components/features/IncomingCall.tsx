import { Avatar, AvatarGroup, Box, Button, Typography } from "@mui/material";
import PhoneCallbackRoundedIcon from '@mui/icons-material/PhoneCallbackRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';

export function IncomingCall() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }}>
      <AvatarGroup max={2}>
        <Avatar
          alt="Remy Sharp"
          src="https://img.freepik.com/premium-photo/graphic-designer-digital-avatar-generative-ai_934475-9292.jpg"
          sx={{ width: 56, height: 56 }}
        />
        <Avatar
          alt="Travis Howard"
          src="https://img.freepik.com/premium-photo/graphic-designer-digital-avatar-generative-ai_934475-9292.jpg"
          sx={{ width: 56, height: 56 }}
        />
      </AvatarGroup>

      <Typography color='primary' variant="h6" sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: .5
      }}>
        <PhoneCallbackRoundedIcon color='primary' />
        <span>Incoming Call</span>
      </Typography>

      <Box
        sx={{
          gap: 1,
          display: 'flex'
        }}
      >
        <Button variant="contained" color='error' endIcon={<HighlightOffRoundedIcon />} >
          Cancel
        </Button>
        <Button variant="contained" color='success' endIcon={<CheckCircleOutlineRoundedIcon />}>
          Accept
        </Button>
      </Box>
    </Box>
  )
}