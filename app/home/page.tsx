import { AppBar, BuddyList, StartCall, Tabs } from "@/components";
import { Box } from "@mui/material";

export default function Home() {

  const tabsContent = [
    {
      title: 'Buddies',
      content: <BuddyList />
    },
    {
      title: 'Rooms',
      content: <></>
    },
    {
      title: 'AI Buddy',
      content: <></>
    }
  ];

  return (
    <Box
      component='main'
      sx={{
        px: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <AppBar />
      <Tabs tabs={tabsContent} />
      <StartCall />
    </Box>
  )
}