import { Typography, Box, IconButton, Paper } from "@mui/material";
import { grey } from "@mui/material/colors";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import TagRoundedIcon from '@mui/icons-material/TagRounded';
import React from "react";

const options = [
  {
    name: 'Bank Transfer',
    icon: <AccountBalanceRoundedIcon color='primary' />
  },
  {
    name: 'USSD',
    icon: <TagRoundedIcon color='primary' />
  },
  {
    name: 'Card Payment',
    icon: <CreditCardRoundedIcon color='primary' />
  }
]

type IOption = {
  icon: React.ReactNode;
  name: string;
}
function Option({ icon, name }: IOption) {
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
        backgroundColor: 'white !important',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {icon}
      </Paper>

      <Typography variant="body2">
        {name}
      </Typography>
    </Box>
  )
}

type IPaymentOptions = {
  onClose?: () => void;
}
export function PaymentOptions({ onClose }: IPaymentOptions) {

  return (
    <Box>
      <IconButton
        sx={{
          mt: 1.5,
          ml: 1.5
        }}
        onClick={onClose}
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

      {
        options.map((option) => (
          <Option
            key={option.name}
            name={option.name}
            icon={option.icon}
          />
        ))
      }
    </Box>
  )
}