import { InCall } from "@/components";
import { WebRTCProvider } from "@/providers";

export default function Page() {
  return (
    <WebRTCProvider>
      <InCall />
    </WebRTCProvider>
  )
}