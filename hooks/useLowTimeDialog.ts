import { AuthenticationContext, LowTimeContext } from "@/providers";
import { useContext } from "react";

export function useLowTimeDialog() {
  const { showLowTimeDialog } = useContext(LowTimeContext);
  const { user } = useContext(AuthenticationContext);

  function showDialog(callback?: () => void) {
    if (Number(user?.minutesLeft) > 0 && callback) {
      callback();
    } else {
      showLowTimeDialog?.();
    }
  }

  return {
    showDialog,
  };
}
