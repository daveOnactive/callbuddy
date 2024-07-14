import { InCall } from "@/components";
import { CallProvider } from "@/providers";

export default function Page() {
  return (
    <CallProvider>
      <InCall />
    </CallProvider>
  )
}