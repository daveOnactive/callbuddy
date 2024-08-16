import { AppBar, BottomBar, BuddyList, Tabs } from "@/components";
import { UsersProvider } from "@/providers";
import { Box } from "@mui/material";
import ComingSoonSVG from '../../public/svg/coming_soon.svg';
import Image from "next/image";

function ComingSoon() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh'
      }}
    >
      <Image
        src={ComingSoonSVG}
        alt='coming soon svg'
        height={350}
        width={350}
      />
    </Box>
  )
}
export default function Home() {

  const tabsContent = [
    {
      title: 'Buddies',
      content: <BuddyList />
    },
    {
      title: 'Rooms',
      content: <ComingSoon />
    },
    {
      title: 'AI Buddy',
      content: <ComingSoon />
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