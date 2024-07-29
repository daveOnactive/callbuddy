import { AppBar, BottomBar, BuddyList, Tabs } from "@/components";
import { UsersProvider } from "@/providers";
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
    <UsersProvider>
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
        <Tabs tabs={tabsContent} sx={{
          marginBottom: '7rem'
        }} />
        <BottomBar />
      </Box>
    </UsersProvider>
  )
}