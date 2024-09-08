import { db } from "@/app/firebase";
import { StatusCode } from "@/types";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function GET() {
  try {
    const topUpRef = query(
      collection(db, "top-up-usd"),
      orderBy("mins", "asc"),
    );

    const topUpSnapshot = await getDocs(topUpRef);

    const data = topUpSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(data);
  } catch (err: any) {
    return Response.json(err.message, {
      status: err.statusCode || StatusCode.SERVER_ERROR,
    });
  }
}
