'use client'
import { Box } from "@mui/material";
import { BuddyCard } from "../molecules";
import { useContext } from "react";
import { UsersContext } from "@/providers";

export function BuddyList() {

  const { users } = useContext(UsersContext)

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 2,
      mt: 2
    }}>
      {
        users?.map(item => (
          <BuddyCard key={item.id} user={item} />
        ))
      }
    </Box>
  )
}