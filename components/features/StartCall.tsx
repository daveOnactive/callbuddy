'use client'
import { useWebRTC } from '@/hooks';
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export function StartCall() {

  const { createCall } = useWebRTC();

  const { push } = useRouter();

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
      onClick={() => {
        // createCall?.();
        push('/incall');
      }}
    >
      Start Call
    </Button>
  )
}