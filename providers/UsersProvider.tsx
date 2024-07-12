'use client'
import { useSnapshotDocs } from "@/hooks";
import { User } from "@/types";
import { createContext, PropsWithChildren, useContext } from "react";
import { AuthenticationContext } from "./AuthenticationProvider";

export const UsersContext = createContext<Partial<{
  users: User[];
}>>({});

export function UsersProvider({ children }: PropsWithChildren) {

  const { user } = useContext(AuthenticationContext);

  const { data } = useSnapshotDocs<User>({
    path: 'users',
    queryOpt: {
      orderBy: 'lastLogin',
      order: 'desc'
    }
  });

  return (
    <UsersContext.Provider
      value={{
        users: data?.filter(item => item.id !== user?.id)
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}