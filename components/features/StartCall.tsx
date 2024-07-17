'use client'
import { generateRandomId } from '@/helpers';
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export function StartCall() {

  const { push } = useRouter();

  return (
    <Button
      endIcon={<VideoCallRoundedIcon />}
      variant='contained'
      color='success'
      sx={{
        position: 'fixed',
        bottom: '5%',
        right: '5%',
        zIndex: 3
      }}
      onClick={() => {
        push(`/incall?callId=${generateRandomId(12)}`);
      }}
    >
      Start Call
    </Button>
  )
}