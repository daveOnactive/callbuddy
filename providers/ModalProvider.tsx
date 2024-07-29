'use client'
import { createContext, forwardRef, PropsWithChildren, useState } from 'react';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Dialog from '@mui/material/Dialog';
import { grey } from '@mui/material/colors';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


type IModalContext = {
  handleOpen: () => void;
  setModalContent: any;
  handleClose: () => void;
  setIsFullScreen: any;
  setBgColor: any;
}

export const ModalContext = createContext<Partial<IModalContext>>({});

export function ModalProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [modelContent, setModalContent] = useState<React.ReactNode | ''>(<></>)
  const [isFullScreen, setIsFullScreen] = useState(false)

  const [bgColor, setBgColor] = useState('');

  const bg = bgColor ? {
    '& .MuiPaper-root': {
      backgroundColor: bgColor
    }
  } : undefined;

  return (
    <ModalContext.Provider
      value={{
        handleOpen,
        setModalContent,
        handleClose,
        setIsFullScreen,
        setBgColor
      }}
    >
      <Dialog
        open={open}
        fullScreen={isFullScreen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={!isFullScreen ? (theme) => ({
          '& .MuiPaper-root': {
            width: { sm: '40% !important', xs: '100% !important' },
            padding: { sm: 3, xs: 2 },
            height: 'fit-content',
            borderRadius: '8px',
          }
        }) : bg}
      >
        {modelContent}
      </Dialog>
      {children}
    </ModalContext.Provider>
  );
}
