'use client'
import { Box } from "@mui/material";
import { BuddyCard } from "../molecules";
import { useContext } from "react";
import { AuthenticationContext, UsersContext } from "@/providers";
import { useRouter } from "next/navigation";
import { User, UserCallStatus } from "@/types";
import { useLowTimeDialog, useUpdateDoc } from "@/hooks";
import { generateRandomId } from "@/helpers";

export function BuddyList() {

  const { users } = useContext(UsersContext);
  const { user: loggedInUser } = useContext(AuthenticationContext);

  const { push } = useRouter();

  const { mutate } = useUpdateDoc('users');

  const { showDialog } = useLowTimeDialog();

  function handleClick(user: User) {
    if (user.call === UserCallStatus.CREATE_CALL) {
      push(`/incall?joinCallId=${user.callId}`);
    } else {
      const callId = generateRandomId(12);
      mutate(user.id, {
        incomingCall: {
          status: UserCallStatus.INCOMING_CALL,
          callerId: loggedInUser?.id,
          callId,
          callerName: loggedInUser?.name,
          callerAvatarUrl: loggedInUser?.avatarUrl
        }
      })

      push(`/incall?callId=${callId}&calleeId=${user?.id}`);
    }
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
          <BuddyCard
            key={item.id}
            user={item}
            onClick={() => {
              showDialog?.(() => handleClick(item));
            }}
          />
        ))
      }
    </Box>
  )
}