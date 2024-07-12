"use client";
import { db } from "@/app/firebase";
import {
  collection,
  onSnapshot,
  where,
  query,
  FieldPath,
  WhereFilterOp,
  orderBy,
  OrderByDirection,
} from "firebase/firestore";
import { useEffect, useState } from "react";

type IProps = {
  path: string;
  queryOpt?: {
    fieldPath?: FieldPath | string;
    opStr?: WhereFilterOp;
    value?: any;
    orderBy?: string;
    order?: OrderByDirection;
  };
};
export function useSnapshotDocs<T>({ path, queryOpt }: IProps) {
  const [data, setData] = useState<T[]>();

  useEffect(() => {
    const dataRef = collection(db, path);

    const queryRef = queryOpt
      ? query(dataRef, orderBy(queryOpt?.orderBy as string, queryOpt.order))
      : undefined;

    const ref = queryRef || dataRef;

    onSnapshot(ref, async (snapshot) => {
      const assets: T[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        assets.push({ ...data, id: doc.id } as T);
      });
      setData(assets);
    });
  }, [queryOpt?.value]);

  return {
    data,
  };
}
