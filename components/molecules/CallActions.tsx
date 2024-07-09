import { Box, Button, IconButton } from "@mui/material";
import SwitchCameraRoundedIcon from '@mui/icons-material/SwitchCameraRounded';
import NoPhotographyRoundedIcon from '@mui/icons-material/NoPhotographyRounded';
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded';
import CallEndRoundedIcon from '@mui/icons-material/CallEndRounded';
import { grey } from "@mui/material/colors";

type IProps = {
  actions: {
    isMuted: boolean;
    isOffCam: boolean;
  };
  toggleMic?: () => void;
  toggleCamera?: () => void;
  switchCamera?: () => void;
  endCall?: () => void;
}

export function CallActions({ actions: { isMuted, isOffCam }, toggleMic, toggleCamera, switchCamera, endCall }: IProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: grey[900],
        width: '90%',
        position: 'absolute',
        bottom: '3%',
        borderRadius: '8px',
        left: '50%',
        transform: 'translateX(-50%)',
        p: 1
      }}
    >
      <IconButton
        onClick={switchCamera}
      >
        <SwitchCameraRoundedIcon sx={{
          color: "white"
        }} />
      </IconButton>
      <IconButton
        onClick={toggleCamera}
        sx={{
          background: isOffCam ? "white !important" : 'unset',
        }}
      >
        <NoPhotographyRoundedIcon sx={{
          color: !isOffCam ? "white" : grey[900],
        }} />
      </IconButton>
      <IconButton
        onClick={toggleMic}
        sx={{
          background: isMuted ? "white !important" : 'unset',
        }}
      >
        <MicOffRoundedIcon sx={{
          color: !isMuted ? "white" : grey[900],
        }} />
      </IconButton>
      <Button onClick={endCall} endIcon={<CallEndRoundedIcon />} variant="contained" size='small' color='error'>
        End
      </Button>
    </Box>
  )
}