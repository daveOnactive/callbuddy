'use client'
import { AuthenticationContext } from '@/providers';
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

export function StartCall() {

  const { push } = useRouter();

  const { user } = useContext(AuthenticationContext);

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
        push(`/incall?callId=${user?.id}`);
      }}
    >
      Start Call
    </Button>
  )
}