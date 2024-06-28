'use client'
import { Avatar, Box, Button, IconButton } from "@mui/material";
import MoreTimeRoundedIcon from '@mui/icons-material/MoreTimeRounded';
import { useEffect } from "react";
import { useModal } from "@/hooks";
import { SelectGender } from "../features";

export function AppBar() {

  const { showModal } = useModal()

  useEffect(() => {
    showModal(<SelectGender />)
  }, [])


  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    }}>
      <Button variant="contained" startIcon={<MoreTimeRoundedIcon />}>
        2 mins remaining
      </Button>


      <Box
        component={IconButton}
      >
        <Avatar src="https://img.freepik.com/premium-photo/graphic-designer-digital-avatar-generative-ai_934475-9292.jpg" alt='Remmy' />
      </Box>
    </Box>
  )
}