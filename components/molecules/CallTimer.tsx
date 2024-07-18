import { Box } from "@mui/material";
import { pink } from "@mui/material/colors";


type IProps = {
  callTime: string;
}

export function CallTimer({ callTime }: Partial<IProps>) {

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        padding: 1,
        background: pink[500],
        borderRadius: 100,
        fontSize: '.65rem',
        fontWeight: 'bold',
        color: 'white'
      }}
    >
      {callTime}
    </Box>
  )
}