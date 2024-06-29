'use client'
import { Box, Button } from "@mui/material";
import MoreTimeRoundedIcon from '@mui/icons-material/MoreTimeRounded';
import { useModal } from "@/hooks";
import { TopUpTime } from ".";
import { pink } from "@mui/material/colors";

export function BuyTime() {
  const { showModal } = useModal();

  function handleOpen() {
    showModal(<TopUpTime />, {
      isFullScreen: true,
      bgColor: pink[200]
    })
  }
  return (
    <Box sx={{
      display: 'flex',
      gap: 1,
      mt: 2,
      justifyContent: 'center'
    }}>
      <Button onClick={handleOpen} size='small' startIcon={<MoreTimeRoundedIcon />}>
        2 mins
      </Button>
      <Button onClick={handleOpen} size='small' variant="contained" color='success'>
        Top Up
      </Button>
    </Box>
  )
}