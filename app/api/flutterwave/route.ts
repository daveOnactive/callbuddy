import { updateUserMins } from "@/services";
import { StatusCode } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const metadata = body.meta_data;
    if (metadata && body.event === "charge.completed") {
      await updateUserMins({
        id: metadata.userId,
        minutes: metadata.minutes,
      });
    }

    // const secretHash = process.env.FLW_SECRET_HASH;
    // const signature = (req.headers as any)["verif-hash"];
    // if (!signature || signature !== secretHash) {
    //   return Response.json("Transaction Unauthorize", {
    //     status: 401,
    //   });
    // }

    return Response.json("Transaction completed");
  } catch (err: any) {
    return Response.json(err.message, {
      status: err.statusCode || StatusCode.SERVER_ERROR,
    });
  }
}
