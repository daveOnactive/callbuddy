import { Typography, Box, Button, IconButton } from "@mui/material";
import { grey } from "@mui/material/colors";
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

function TopUpItem() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderBottom: `1px solid ${grey[900]}`,
        py: 1.5
      }}
    >
      <Typography variant="body2">
        5 mins
      </Typography>

      <Box>
        <Typography variant="subtitle2">
          500
        </Typography>
        <Typography sx={{
          textDecoration: 'line-through'
        }} variant="subtitle2" fontWeight={100}>
          500
        </Typography>
      </Box>

      <Typography color='primary' fontSize='.8rem'>
        <LocalOfferRoundedIcon /> 50% off
      </Typography>

      <Button variant="contained" size='small'>
        Purchase
      </Button>
    </Box>
  )
}

export function TopUpTime() {
  return (
    <Box>
      <IconButton
        sx={{
          mt: 1.5,
          ml: 1.5
        }}
      >
        <ArrowBackIosNewRoundedIcon sx={{ color: grey[900] }} />
      </IconButton>
      <Typography
        variant="subtitle1"
        fontWeight={500}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: .5,
          justifyContent: 'center',
          my: 2
        }}
      >
        <LocalMallRoundedIcon /><span>Top up Mins</span>
      </Typography>

      <TopUpItem />
      <TopUpItem />
      <TopUpItem />
      <TopUpItem />
      <TopUpItem />
    </Box>
  )
}