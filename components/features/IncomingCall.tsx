'use client'
import { Avatar, Box, Button, Typography } from "@mui/material";
import PhoneCallbackRoundedIcon from '@mui/icons-material/PhoneCallbackRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { useUpdateDoc } from "@/hooks";
import { useRouter } from "next/navigation";
import { User, UserCallStatus } from "@/types";

type IProps = {
  user: User;
  closeModal?: () => void;
}
export function IncomingCall({ user, closeModal }: IProps) {
  const { mutate } = useUpdateDoc('users');

  const { push } = useRouter();

  function cancelCall() {
    closeModal?.()
    mutate(user?.id as string, {
      incomingCall: {
        status: UserCallStatus.NOT_IN_CALL
      }
    });
  }

  const isMinutesLeft = Number(user?.minutesLeft) > 0;

  function acceptCall() {
    closeModal?.();
    if (isMinutesLeft) {
      mutate(user?.id as string, {
        incomingCall: {
          status: UserCallStatus.IN_CALL
        }
      })

      push(`/incall?joinCallId=${user?.incomingCall?.callId}`);
    } else {
      cancelCall();
      push('/top-up');
    }

  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }}>
      <Avatar
        alt="Travis Howard"
        src={user?.incomingCall?.callerAvatarUrl}
        sx={{ width: 35, height: 35 }}
      />
      <Typography color='primary' variant="subtitle2" sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: .5
      }}>
        <PhoneCallbackRoundedIcon fontSize="small" color='primary' />
        <span>Incoming call from {user?.incomingCall?.callerName}</span>
      </Typography>

      <Box
        sx={{
          gap: 1,
          display: 'flex'
        }}
      >
        <Button onClick={cancelCall} variant="contained" color='error' endIcon={<HighlightOffRoundedIcon />} >
          Cancel
        </Button>
        <Button onClick={acceptCall} variant="contained" color='success' endIcon={<CheckCircleOutlineRoundedIcon />}>
          {isMinutesLeft ? 'Accept' : 'Top up'}
        </Button>
      </Box>
    </Box>
  )
}