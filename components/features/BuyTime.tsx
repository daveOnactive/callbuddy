'use client'
import { Box, Button, Card, Typography } from "@mui/material";
import MoreTimeRoundedIcon from '@mui/icons-material/MoreTimeRounded';
import { useRouter } from 'next/navigation';
import Rating from '@mui/material/Rating';
import { useContext } from "react";
import { AuthenticationContext } from "@/providers";

export function BuyTime() {
  const { push } = useRouter();

  const { user } = useContext(AuthenticationContext);

  return (
    <Box sx={{
      display: 'flex',
      gap: 1,
      mt: 2,
      justifyContent: 'center',
      height: '4rem'
    }}>
      <Card variant="outlined" sx={{
        p: 3,
        height: '100%'
      }}>
        <Typography>
          <span>{user?.minutesLeft} mins left</span>
        </Typography>
        <Button
          sx={{
            mt: 2
          }}
          startIcon={<MoreTimeRoundedIcon />}
          size='small'
          variant="text"
          color='success'
          onClick={() => push('top-up')}
        >
          Top Up
        </Button>
      </Card>
      <Card sx={{
        p: 3,
        height: '100%'
      }} variant="outlined">
        <Typography component="legend">Rating</Typography>
        <Rating name="Rating" value={user?.rank} readOnly />
      </Card>

    </Box>
  )
}