import { Box, Button, IconButton } from "@mui/material";
import SwitchCameraRoundedIcon from '@mui/icons-material/SwitchCameraRounded';
import NoPhotographyRoundedIcon from '@mui/icons-material/NoPhotographyRounded';
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded';
import CallEndRoundedIcon from '@mui/icons-material/CallEndRounded';
import { grey } from "@mui/material/colors";

export function CallActions() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: grey[900],
        width: '90%',
        position: 'absolute',
        bottom: '8%',
        borderRadius: '8px',
        left: '50%',
        transform: 'translateX(-50%)',
        p: 1
      }}
    >
      <IconButton>
        <SwitchCameraRoundedIcon sx={{
          color: "white"
        }} />
      </IconButton>
      <IconButton
        sx={{
          background: 'white !important'
        }}
        disableRipple
      >
        <NoPhotographyRoundedIcon sx={{
          color: grey[900]
        }} />
      </IconButton>
      <IconButton>
        <MicOffRoundedIcon sx={{
          color: "white"
        }} />
      </IconButton>
      <Button endIcon={<CallEndRoundedIcon />} variant="contained" size='small' color='error'>
        End
      </Button>
    </Box>
  )
}