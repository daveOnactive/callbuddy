import { ModalContext } from "@/providers";
import { useContext } from "react";

type IOptions = {
  isFullScreen?: boolean;
  bgColor?: string;
};

export function useModal() {
  const {
    handleOpen,
    setModalContent,
    handleClose,
    setIsFullScreen,
    setBgColor,
  } = useContext(ModalContext);

  function showModal(content: React.ReactNode, options?: IOptions) {
    handleOpen?.();
    setModalContent?.(content);

    setIsFullScreen?.(options?.isFullScreen);
    setBgColor?.(options?.bgColor);
  }

  return {
    showModal,
    handleModalClose: handleClose,
  };
}
