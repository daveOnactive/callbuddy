import { Typography, Box, Button, IconButton, Paper } from "@mui/material";
import { grey } from "@mui/material/colors";
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

function Option() {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        borderBottom: `1px solid ${grey[900]}`,
        p: 1.5
      }}
    >

      <Paper variant="outlined" sx={{
        width: 50,
        height: 50,
        backgroundColor: 'white !important'
      }}>

      </Paper>

      <Typography variant="body2">
        Transfer
      </Typography>
    </Box>
  )
}

export function PaymentOptions() {

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
        Easy Payment
      </Typography>

      <Option />
      <Option />
      <Option />
      <Option />
    </Box>
  )
}