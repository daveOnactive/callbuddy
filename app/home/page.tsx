import { AppBar, BuddyCard, Tabs } from "@/components";
import { Box } from "@mui/material";

export default function Home() {
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
      <Tabs />
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 2,
        mt: 2
      }}>
        {
          [1, 2, 3, 4, 5, 6, 7].map(item => (
            <BuddyCard key={item} />
          ))
        }
      </Box>

    </Box>
  )
}