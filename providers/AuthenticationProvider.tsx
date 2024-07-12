'use client'
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db } from "@/app/firebase";
import { User } from "@/types";
import { useSnapshot } from "@/hooks";

export const AuthenticationContext = createContext<Partial<{
  isCreatingUser: boolean;
  fastLogin: () => Promise<void>;
  user: User;
  logout: () => void
}>>({});

export function AuthenticationProvider({ children }: PropsWithChildren) {

  const pathname = usePathname();
  const { push } = useRouter();
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  function saveUserIdToStorage(id: string) {
    localStorage.setItem('user', id);
  }

  function retrieveUserIdFromStorage() {
    if (typeof window === "undefined") {
      return;
    }
    return localStorage.getItem('user');
  }

  function logout() {
    localStorage.clear();
    push('/');
  }

  const userId = retrieveUserIdFromStorage() as string;

  const { data } = useSnapshot<User>({
    path: 'users',
    id: userId
  });

  useEffect(() => {
    if (!userId && pathname !== '/') {
      push('/')
    }
  }, [push]);

  useEffect(() => {
    if (userId && pathname === '/') {
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
        fastLogin,
        user: data,
        logout
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}