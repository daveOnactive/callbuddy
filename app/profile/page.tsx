import { BuyTime, Logout, ProfileHeader } from "@/components";
import { Box } from "@mui/material";

export default function Profile() {
  return (
    <Box>
      <ProfileHeader />
      <BuyTime />
      <Logout />
    </Box>
  )
}