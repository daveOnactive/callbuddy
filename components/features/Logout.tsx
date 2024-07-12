'use client'
import { Button } from "@mui/material";
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import { AuthenticationContext } from "@/providers";
import { useContext } from "react";

export function Logout() {
  const { logout } = useContext(AuthenticationContext);

  return (
    <Button
      onClick={logout}
      endIcon={<ExitToAppRoundedIcon />} variant="contained" color='error' sx={{
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