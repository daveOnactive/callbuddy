'use client'
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db } from "@/app/firebase";
import { User } from "@/types";

export const AuthenticationContext = createContext<Partial<{
  isCreatingUser: boolean;
  fastLogin: () => Promise<void>
}>>({});

export function AuthenticationProvider({ children }: PropsWithChildren) {

  const pathname = usePathname();
  const { push } = useRouter();
  const [isCreatingUser, setIsCreatingUser] = useState(false);


  function saveUserIdToStorage(id: string) {
    localStorage.setItem('user', id);
  }

  function retrieveUserIdFromStorage() {
    return localStorage.getItem('user');
  }

  useEffect(() => {
    const user = retrieveUserIdFromStorage();
    if (!user && pathname !== '/') {
      push('/')
    }
  }, [push]);

  useEffect(() => {
    const user = retrieveUserIdFromStorage();
    if (user && pathname === '/') {
      push('/home')
    }
  }, []);

  async function fastLogin() {

    const userData: Partial<User> = {
      name: 'Fire Fox',
      rank: 'Novice',
      incall: false,
      avatarUrl: 'https://img.freepik.com/premium-photo/graphic-designer-digital-avatar-generative-ai_934475-9292.jpg',
      minutesLeft: '2'
    }

    try {
      setIsCreatingUser(true);
      const userRef = collection(db, 'users');

      const user = await addDoc(userRef, {
        ...userData
      });

      saveUserIdToStorage(user.id);

      push('/home');

    } catch (err: any) {
      throw new Error(err.message)
    } finally {
      setIsCreatingUser(false);
    }
  }


  return (
    <AuthenticationContext.Provider
      value={{
        isCreatingUser,
        fastLogin
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}