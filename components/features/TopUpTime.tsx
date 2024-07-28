'use client'
import { Typography, Box, Button } from "@mui/material";
import { grey } from "@mui/material/colors";
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import { useAlert } from "@/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "@/services";
import { Currency, TopUp } from "@/types";
import { numberFormat } from "@/helpers";
import { useContext, useEffect } from "react";
import { AuthenticationContext } from "@/providers";
import PaystackPop from '@paystack/inline-js'

type ITopUpItem = {
  onClick: (topUp: TopUp) => void;
  data: TopUp;
  isDisabled?: boolean;
}

type InitPayment = {
  name: string;
  id: string;
  minutes: string;
  amount: string;
}

function TopUpItem({ onClick, data, isDisabled }: ITopUpItem) {
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

      <Button
        onClick={() => onClick(data)}
        variant="contained"
        size='small'
        disabled={isDisabled}
      >
        Purchase
      </Button>
    </Box>
  )
}

export function TopUpTime() {
  const { showNotification } = useAlert();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
  }, []);

  const { user } = useContext(AuthenticationContext);

  const { data, isLoading } = useQuery<TopUp[]>({
    queryKey: ['top-up'],
    queryFn: async () => (await Api.get('/top-up')).data
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Partial<InitPayment>) => (await Api.post('/paystack/initialize-payment', data)).data
  });

  function handleOpen(topUp: TopUp) {

    mutate({
      name: user?.name,
      id: user?.id,
      minutes: topUp.mins,
      amount: topUp.price,
    }, {
      onSuccess: (data) => {
        const popup = new PaystackPop()
        popup.resumeTransaction(data?.data?.access_code)
      },
      onError: (data) => {
        showNotification({
          message: data.message,
          type: 'error'
        })
      },
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
            isDisabled={isPending}
          />
        ))
      }
    </Box>
  )
}