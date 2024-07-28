import { db } from "@/app/firebase";
import { StatusCode } from "@/types";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const jsonString = JSON.stringify(body, null, 2);

    const metadataRegex = /"metadata":\s*({[^}]*})/;
    const metadataMatch = jsonString.match(metadataRegex);

    if (metadataMatch && body.event === "charge.success") {
      const metadataString = metadataMatch[1];
      const metadata = JSON.parse(metadataString);

      const userRef = doc(db, "users", metadata.id);

      const user = (await getDoc(userRef)).data();

      const minutesLeft = Number(user?.minutesLeft) + Number(metadata.minutes);

      await updateDoc(userRef, {
        ...user,
        minutesLeft,
      });
    }
    return Response.json("Transaction completed");
  } catch (err: any) {
    return Response.json(err.message, {
      status: err.statusCode || StatusCode.SERVER_ERROR,
    });
  }
}
