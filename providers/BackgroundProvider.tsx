'use client'
import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

export function BackgroundProvider({ children }: PropsWithChildren) {
  return (
    <Box
      sx={({ palette: { background } }) => ({
        background: background.default,
        minHeight: '100vh'
      })}
    >
      {children}
    </Box>
  )
}