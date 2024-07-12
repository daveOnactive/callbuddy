'use client'
import { useAlert } from "@/hooks";
import { User } from "@/types";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "./AuthenticationProvider";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/app/firebase";

export const UsersContext = createContext<Partial<{
  users: User[];
}>>({});

export function UsersProvider({ children }: PropsWithChildren) {

  const { user } = useContext(AuthenticationContext);

  const [data, setData] = useState<User[]>();

  const { showNotification } = useAlert();

  async function getData() {
    try {
      const dataRef = collection(db, 'users');

      const ref = query(dataRef, orderBy('lastLogin', 'asc'))

      onSnapshot(ref, async (snapshot) => {
        const assets: User[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          assets.push({ ...data, id: doc.id } as User);
        });
        setData(assets);
      });
    } catch (err: any) {
      showNotification({
        message: err.message,
        type: "error",
      });
    }
  }

  useEffect(() => {
    getData()
  }, [])

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
