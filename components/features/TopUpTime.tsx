'use client'
import { Typography, Box, Button } from "@mui/material";
import { grey, pink } from "@mui/material/colors";
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import { useModal } from "@/hooks";
import { PaymentOptions } from "./PaymentOptions";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@/services";
import { Currency, TopUp } from "@/types";
import { numberFormat } from "@/helpers";

type ITopUpItem = {
  onClick: () => void;
  data: TopUp;
}

function TopUpItem({ onClick, data }: ITopUpItem) {
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
        {data.mins} mins
      </Typography>

      <Box>
        <Typography variant="subtitle2">
          {numberFormat(Number(data.price), Currency.NGN)}
        </Typography>
        <Typography sx={{
          textDecoration: 'line-through'
        }} variant="subtitle2" fontWeight={100}>
          {numberFormat(Number(data.discount), Currency.NGN)}
        </Typography>
      </Box>

      <Typography color='primary' fontSize='.8rem'>
        <LocalOfferRoundedIcon /> 50% off
      </Typography>

      <Button onClick={onClick} variant="contained" size='small'>
        Purchase
      </Button>
    </Box>
  )
}

export function TopUpTime() {
  const { showModal } = useModal();

  const { data, isLoading } = useQuery<TopUp[]>({
    queryKey: ['top-up'],
    queryFn: async () => (await Api.get('/top-up')).data
  });

  function handleOpen() {
    showModal(<PaymentOptions />, {
      isFullScreen: true,
      bgColor: pink[200]
    })
  }

  if (isLoading) return <>loading...</>

  return (
    <Box>
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

      {
        data?.map(item => (
          <TopUpItem
            onClick={handleOpen}
            data={item}
            key={item.id}
          />
        ))
      }
    </Box>
  )
}