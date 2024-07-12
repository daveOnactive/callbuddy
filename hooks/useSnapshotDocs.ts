"use client";
import { db } from "@/app/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

type IProps = {
  path: string;
};
export function useSnapshotDocs<T>({ path }: IProps) {
  const [data, setData] = useState<T[]>();

  useEffect(() => {
    const dataRef = collection(db, path);
    onSnapshot(dataRef, async (snapshot) => {
      const assets: T[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        assets.push({ ...data, id: doc.id } as T);
      });
      setData(assets);
    });
  }, [path]);

  return {
    data,
  };
}
