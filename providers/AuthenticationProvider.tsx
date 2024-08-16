'use client'
import { createContext, PropsWithChildren, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { User } from "@/types";
import { useAlert, useSnapshot } from "@/hooks";
import { generateUser } from "@/helpers";
import { useMutation } from "@tanstack/react-query";
import { Api } from "@/services";

export const AuthenticationContext = createContext<Partial<{
  isCreatingUser: boolean;
  fastLogin: () => void;
  user: User;
  logout: () => void;
}>>({});

export function AuthenticationProvider({ children }: PropsWithChildren) {

  const pathname = usePathname();
  const { push } = useRouter();
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const isMounted = useRef(false);

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

  const { mutate } = useMutation({
    mutationFn: async (data: Partial<User>) => await Api.post('/user', data)
  })

  const { showNotification } = useAlert();

  const userId = retrieveUserIdFromStorage() as string;

  const { data } = useSnapshot<User>({
    path: 'users',
    id: userId
  });

  const { mutate: mutateUser } = useMutation({
    mutationFn: async (data: Partial<User>) => await Api.put(`/user/${userId}`, data)
  })

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

  useEffect(() => {
    if (userId) {
      mutateUser({
        lastLogin: new Date().toISOString()
      });
    }
  }, [userId]);

  function fastLogin() {

    const userNameAndAvatar = generateUser();

    const userData: Partial<User> = {
      ...userNameAndAvatar,
      rank: 0,
      minutesLeft: '1',
      lastLogin: new Date().toISOString(),
    }

    setIsCreatingUser(true);

    mutate(userData, {
      onSuccess: (res) => {
        saveUserIdToStorage(res.data);
        setIsCreatingUser(false);
        push('/home');
      },
      onError: (err) => {
        setIsCreatingUser(false);
        showNotification({
          message: err.message,
          type: 'error'
        });
      }
    })
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