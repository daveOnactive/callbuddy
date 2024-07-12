"use client";
import { db } from "@/app/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

type IProps = {
  path: string;
  id?: string;
};
export function useSnapshot<T>({ path, id }: IProps) {
  const [data, setData] = useState<T>();

  useEffect(() => {
    onSnapshot(doc(db, path, String(id)), async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as T;

        setData({
          ...data,
          id: snapshot.id,
        });
      }
    });
  }, [path, id]);

  return {
    data,
  };
}
