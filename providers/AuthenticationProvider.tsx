'use client'
import { createContext, PropsWithChildren, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { User } from "@/types";
import { useAlert, useSnapshot } from "@/hooks";
import { getActiveUntil } from "@/helpers";
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

  // const { mutate } = useUpdateDoc('users')

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

  // useEffect(() => {
  //   const isActive = data && new Date(data.lastLogin) === getActiveUntil(data.lastLogin);


  //   if (isMounted.current === false && data && data.lastLogin !== new Date().toISOString()) {
  //     mutate(data.id, {
  //       lastLogin: new Date().toISOString()
  //     });

  //     isMounted.current = true;
  //   }
  // }, [data]);

  function fastLogin() {

    const userData: Partial<User> = {
      name: 'Fire Fox',
      rank: 3,
      incall: false,
      avatarUrl: 'https://img.freepik.com/premium-photo/graphic-designer-digital-avatar-generative-ai_934475-9292.jpg',
      minutesLeft: '2',
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