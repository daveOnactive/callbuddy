'use client'
import { useModal } from "@/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { createContext, PropsWithChildren } from "react";
import TimelapseRoundedIcon from '@mui/icons-material/TimelapseRounded';
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
        <TimelapseRoundedIcon sx={{
          color: red[500],
          fontSize: '2rem',
        }} />
        <Typography my={2} variant="body1">Opp you have run out of call time.</Typography>
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