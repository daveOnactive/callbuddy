'use client'
import { Typography, Box, Button, Skeleton } from "@mui/material";
import { grey } from "@mui/material/colors";
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import { useAlert } from "@/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "@/services";
import { Currency, TopUp, User } from "@/types";
import { generateTextRef, numberFormat } from "@/helpers";
import { useContext, useState } from "react";
import { AuthenticationContext } from "@/providers";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useFlutterwave } from 'flutterwave-react-v3';
import { FlutterwaveConfig } from "flutterwave-react-v3/dist/types";
import { useRouter } from "next/navigation";

type ITopUpItem = {
  onClick: (topUp: TopUp) => void;
  data: TopUp;
  isDisabled?: boolean;
  currency: Currency;
  isUSD?: boolean;
  user?: User;
}

type InitPayment = {
  name: string;
  id: string;
  minutes: string;
  amount: string;
}

function TopUpSkeleton() {
  return (
    <>
      <Skeleton
        width='100%'
        height={65}
        sx={{
          my: 1.5
        }}
        variant="rounded"
      />
      <Skeleton
        width='100%'
        height={65}
        sx={{
          my: 1.5
        }}
        variant="rounded"
      />
      <Skeleton
        width='100%'
        height={65}
        sx={{
          my: 1.5
        }}
        variant="rounded"
      />
      <Skeleton
        width='100%'
        height={65}
        sx={{
          my: 1.5
        }}
        variant="rounded"
      />
    </>
  )
}

function TopUpItem({ onClick, data, isDisabled, currency, isUSD, user }: ITopUpItem) {
  const { push } = useRouter();

  const config = {
    meta: {
      userId: user?.id,
      minutes: data?.mins,
    },
    customer: {
      name: user?.name,
      email: `${user?.name.replace(' ', '+')}@callbuddy.live`,
      userId: user?.id,
    },
    customizations: {
      title: "CallBuddy",
      description: "1-on-1 call platform",
      logo: "https://checkout.flutterwave.com/assets/img/rave-logo.png",
    },
    public_key: process.env.NEXT_PUBLIC_PUBLIC_KEY,
    tx_ref: generateTextRef(),
    amount: data?.price,
    currency: "USD",
    payment_options: "card, account, googlepay, applepay",
  } as unknown as FlutterwaveConfig;

  const handleFlutterPayment = useFlutterwave(config);

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
          {numberFormat(Number(data.price), currency)}
        </Typography>
        <Typography sx={{
          textDecoration: 'line-through'
        }} variant="subtitle2" fontWeight={100}>
          {numberFormat(Number(data.discount), currency)}
        </Typography>
      </Box>

      <Typography color='primary' fontSize='.8rem'>
        <LocalOfferRoundedIcon /> 50% off
      </Typography>

      <Button
        onClick={() => isUSD ? handleFlutterPayment({
          callback: (_res) => {
            push('/home')
          },
          onClose: () => { }
        }) : onClick(data)}
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

  const [isDisabled, setIsDisabled] = useState(false);

  const [value, setValue] = useState('ngn');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const { user } = useContext(AuthenticationContext);

  const { data, isLoading } = useQuery<TopUp[]>({
    queryKey: ['top-up'],
    queryFn: async () => (await Api.get('/top-up')).data
  });

  const { data: topUpUsd } = useQuery<TopUp[]>({
    queryKey: ['top-up-usd'],
    queryFn: async () => (await Api.get('/top-up-usd')).data
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
      onSuccess: async (data) => {
        const PaystackPop = (await import('@paystack/inline-js')).default;
        const popup = new PaystackPop()
        if (popup) {
          popup.resumeTransaction(data?.data?.access_code);
        }
      },
      onError: (data) => {
        showNotification({
          message: data.message,
          type: 'error'
        })
      },
    })
  }


  function handlePayUsd(_topUp: TopUp) {
    setIsDisabled(true)
  }

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
        <LocalMallRoundedIcon /><span>Top Up Call Time</span>
      </Typography>

      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList sx={{
            '& .MuiTabs-flexContainer': {
              justifyContent: 'center'
            }
          }} onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="NGN" value="ngn" />
            <Tab label="USD" value="usd" />
          </TabList>
        </Box>
        <TabPanel value="ngn">
          <>
            {
              isLoading ? (
                <TopUpSkeleton />
              ) : data?.map(item => (
                <TopUpItem
                  onClick={handleOpen}
                  data={item}
                  key={item.id}
                  isDisabled={isPending}
                  currency={Currency.NGN}
                  user={user}
                />
              ))
            }
          </>
        </TabPanel>
        <TabPanel value="usd">
          <>
            {
              isLoading ? (
                <TopUpSkeleton />
              ) : topUpUsd?.map(item => (
                <TopUpItem
                  onClick={handlePayUsd}
                  data={item}
                  key={item.id}
                  isDisabled={isDisabled}
                  currency={Currency.USD}
                  isUSD
                  user={user}
                />
              ))
            }
          </>
        </TabPanel>
      </TabContext>
    </Box>
  )
}