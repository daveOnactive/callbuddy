'use client'
import { Box } from "@mui/material";
import { BuddyCard } from "../molecules";
import { useContext } from "react";
import { UsersContext } from "@/providers";
import { useRouter } from "next/navigation";

export function BuddyList() {

  const { users } = useContext(UsersContext);

  const { push } = useRouter();

  function handleJoinCall(callId: string) {
    push(`/incall?joinCallId=${callId}`);
  }

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 2,
      mt: 2
    }}>
      {
        users?.map(item => (
          <BuddyCard key={item.id} user={item} onClick={() => handleJoinCall(item.callId)} />
        ))
      }
    </Box>
  )
}