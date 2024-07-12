'use client'
import { Avatar, Box, Button, IconButton } from "@mui/material";
import MoreTimeRoundedIcon from '@mui/icons-material/MoreTimeRounded';
import { useContext, useEffect } from "react";
import { useModal } from "@/hooks";
import { SelectGender } from ".";
import { AuthenticationContext } from "@/providers";
import { useRouter } from "next/navigation";

export function AppBar() {

  const { showModal, handleModalClose } = useModal();

  const { user } = useContext(AuthenticationContext);

  const { push } = useRouter();

  useEffect(() => {
    if (user && !user?.gender) {
      showModal(<SelectGender closeModal={handleModalClose} userId={user.id} />)
    }
  }, [user])


  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    }}>
      <Button variant="contained" startIcon={<MoreTimeRoundedIcon />}>
        {user?.minutesLeft || 0} mins remaining
      </Button>


      <Box
        component={IconButton}
        onClick={() => push('/profile')}
      >
        <Avatar src={user?.avatarUrl} alt='Remmy' />
      </Box>
    </Box>
  )
}