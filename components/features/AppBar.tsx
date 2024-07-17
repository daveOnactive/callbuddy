'use client'
import { Avatar, Box, Button, IconButton } from "@mui/material";
import MoreTimeRoundedIcon from '@mui/icons-material/MoreTimeRounded';
import { useContext, useEffect } from "react";
import { useModal } from "@/hooks";
import { IncomingCall, SelectGender } from ".";
import { AuthenticationContext } from "@/providers";
import { useRouter } from "next/navigation";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { UserCallStatus } from "@/types";

type IProps = {
  hasBackButton?: boolean;
}

export function AppBar({ hasBackButton }: IProps) {

  const { showModal, handleModalClose } = useModal();

  const { user } = useContext(AuthenticationContext);

  const { push } = useRouter();

  useEffect(() => {
    if (user && !user?.gender) {
      showModal(<SelectGender closeModal={handleModalClose} userId={user.id} />)
    }

    if (user && user.incomingCall?.status === UserCallStatus.INCOMING_CALL) {
      showModal(<IncomingCall user={user} closeModal={handleModalClose} />)
    }
  }, [user]);


  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    }}>

      {
        hasBackButton ? (
          <IconButton
            onClick={() => push('/home')}
          >
            <ArrowBackIosNewRoundedIcon sx={{ color: '#111' }} />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            onClick={() => push('/top-up')}
            startIcon={<MoreTimeRoundedIcon />}>
            {user?.minutesLeft || 0} mins remaining
          </Button>
        )
      }


      <Box
        component={IconButton}
        onClick={() => push('/profile')}
      >
        <Avatar src={user?.avatarUrl} alt='Remmy' />
      </Box>
    </Box>
  )
}