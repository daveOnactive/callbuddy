import { Box, Button } from "@mui/material";
import MoreTimeRoundedIcon from '@mui/icons-material/MoreTimeRounded';

export function BuyTime() {
  return (
    <Box sx={{
      display: 'flex',
      gap: 1,
      mt: 2,
      justifyContent: 'center'
    }}>
      <Button size='small' startIcon={<MoreTimeRoundedIcon />}>
        2 mins
      </Button>
      <Button size='small' variant="contained" color='success'>
        Top Up
      </Button>
    </Box>
  )
}