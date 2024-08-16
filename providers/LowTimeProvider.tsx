'use client'
import { useModal } from "@/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { createContext, PropsWithChildren } from "react";
import HourglassDisabledRoundedIcon from '@mui/icons-material/HourglassDisabledRounded';
import { red } from "@mui/material/colors";

export const LowTimeContext = createContext<{
  showLowTimeDialog?: () => void;
}>({});

export function LowTimeProvider({ children }: PropsWithChildren) {
  const { showModal, handleModalClose } = useModal();

  const { push } = useRouter();

  function showLowTimeDialog() {
    showModal(
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <HourglassDisabledRoundedIcon sx={{
          color: red[500],
          fontSize: '2rem',
        }} />
        <Typography my={2} variant="body1">It seems your call time has ended.</Typography>
        <Button
          variant="contained"
          color='primary'
          onClick={() => {
            push('/top-up')
            handleModalClose?.()
          }}
        >
          TopUp
        </Button>
      </Box>
    )
  }
  return (
    <LowTimeContext.Provider
      value={{
        showLowTimeDialog
      }}
    >
      {children}
    </LowTimeContext.Provider>
  )
}