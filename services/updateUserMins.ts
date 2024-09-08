import { db } from "@/app/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

type IMetadata = {
  id: string;
  minutes: string;
};

export async function updateUserMins(metadata: IMetadata) {
  const userRef = doc(db, "users", metadata.id);

  const user = (await getDoc(userRef)).data();

  const minutesLeft = Number(user?.minutesLeft) + Number(metadata.minutes);

  await updateDoc(userRef, {
    ...user,
    minutesLeft,
  });
}
