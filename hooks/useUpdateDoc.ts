import { db } from "@/app/firebase";
import { doc, updateDoc } from "firebase/firestore";

export function useUpdateDoc(path: string) {
  async function mutate(id: string, data: { [key: string]: any }) {
    try {
      const updateRef = doc(db, path, id);
      await updateDoc(updateRef, data);

      return updateRef.id;
    } catch (err: any) {
      throw new Error(err.message);
    } finally {
    }
  }

  return {
    mutate,
  };
}
