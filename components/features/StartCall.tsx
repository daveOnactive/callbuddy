import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded';
import { Button } from '@mui/material';

export function StartCall() {
  return (
    <Button
      endIcon={<VideoCallRoundedIcon />}
      variant='contained'
      color='success'
      sx={{
        position: 'fixed',
        bottom: '5%',
        right: '5%'
      }}
    >
      Start Call
    </Button>
  )
}