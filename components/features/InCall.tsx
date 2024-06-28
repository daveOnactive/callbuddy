import { Box } from "@mui/material";
import { CallActions } from "../molecules";
import { grey, pink } from "@mui/material/colors";

export function InCall() {
  return (
    <Box sx={{
      width: '100%',
      height: '100vh',
      position: 'relative'
    }}>
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          background: grey[400]
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: '35%',
          height: '30%',
          background: grey[900],
          borderRadius: '8px'
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          left: '5%',
          padding: 1,
          background: pink[500],
          borderRadius: 100,
          fontSize: '.5rem',
          fontWeight: 'bold',
          color: 'white'
        }}
      >
        15m
      </Box>

      <CallActions />
    </Box>
  )
}