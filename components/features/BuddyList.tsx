'use client'

import { useSnapshotDocs } from "@/hooks"
import { User } from "@/types";
import { Box } from "@mui/material";
import { BuddyCard } from "../molecules";

export function BuddyList() {
  const { data } = useSnapshotDocs<User>({
    path: 'users'
  });

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 2,
      mt: 2
    }}>
      {
        data?.map(item => (
          <BuddyCard key={item.id} user={item} />
        ))
      }
    </Box>
  )
}