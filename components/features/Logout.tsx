import { Button } from "@mui/material";
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';

export function Logout() {
  return (
    <Button endIcon={<ExitToAppRoundedIcon />} variant="contained" color='error' sx={{
      position: 'absolute',
      bottom: '5%',
      width: '90%',
      left: '50%',
      transform: 'translateX(-50%)'
    }}>
      Logout
    </Button>
  )
}