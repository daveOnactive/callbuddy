import { TopUpTime, AppBar } from "@/components";
import { Box } from "@mui/material";

export default function TopUp() {
  return (
    <Box>
      <AppBar hasBackButton />
      <TopUpTime />
    </Box>
  )
}