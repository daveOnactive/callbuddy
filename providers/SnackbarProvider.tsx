'use client'
import { IAlert } from "@/types";
import { Snackbar, Alert } from "@mui/material";
import { createContext, PropsWithChildren, useState } from "react";

type ISnackbarProvider = {
  setMessage: any;
  setType: any;
  handleClick: any;
}

export const SnackbarContext = createContext<Partial<ISnackbarProvider>>({});

export function SnackbarProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<IAlert>('success');

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <SnackbarContext.Provider
      value={{
        handleClick,
        setMessage,
        setType
      }}
    >
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert
          onClose={handleClose}
          severity={type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  )
}