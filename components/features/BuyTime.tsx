'use client'
import { Box, Button, Card, Typography } from "@mui/material";
import MoreTimeRoundedIcon from '@mui/icons-material/MoreTimeRounded';
import { useRouter } from 'next/navigation';
import Rating from '@mui/material/Rating';
import { useContext } from "react";
import { AuthenticationContext } from "@/providers";
import { getUserRank } from "@/helpers";

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
          <span>{parseFloat(user?.minutesLeft || '').toFixed(1) || 0} mins left</span>
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
        <Rating name="Rating" value={getUserRank(user?.rank as number || 0)} readOnly />
      </Card>

    </Box>
  )
}