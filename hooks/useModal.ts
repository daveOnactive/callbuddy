import { ModalContext } from "@/providers";
import { useContext } from "react";

export function useModal() {
  const { handleOpen, setModalContent, handleClose } = useContext(ModalContext);

  function showModal(content: React.ReactNode) {
    handleOpen?.();
    setModalContent?.(content);
  }

  return {
    showModal,
    handleModalClose: handleClose,
  };
}
