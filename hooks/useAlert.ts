import { SnackbarContext } from "@/providers";
import { IAlert } from "@/types";
import { useContext } from "react";

type INotification = {
  message: string;
  type: IAlert;
};

export function useAlert() {
  const { handleClick, setMessage, setType } = useContext(SnackbarContext);

  function showNotification({ message, type }: INotification) {
    handleClick();
    setMessage(message);
    setType(type);
  }

  return {
    showNotification,
  };
}
