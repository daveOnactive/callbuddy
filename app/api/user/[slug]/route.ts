import { db } from "@/app/firebase";
import { StatusCode } from "@/types";
import { doc, updateDoc } from "firebase/firestore";

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const res = await request.json();

    const slug = params.slug;

    const assetRef = doc(db, "users", slug);

    await updateDoc(assetRef, {
      ...res,
    });

    return Response.json({ message: "User updated!" });
  } catch (err: any) {
    return Response.json(
      { ...err.message },
      {
        status: err.statusCode || StatusCode.SERVER_ERROR,
      },
    );
  }
}
