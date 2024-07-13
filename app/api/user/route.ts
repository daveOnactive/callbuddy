import { db } from "@/app/firebase";
import { StatusCode } from "@/types";
import { addDoc, collection } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const userRef = collection(db, "users");

    const body = await req.json();

    const user = await addDoc(userRef, {
      ...body,
    });

    return Response.json(user.id, {
      status: StatusCode.OK,
    });
  } catch (err: any) {
    return Response.json(err.message, {
      status: err.statusCode,
    });
  }
}
