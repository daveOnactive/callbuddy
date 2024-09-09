import { StatusCode } from "@/types";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { id, amount, name, minutes } = await req.json();

    const res = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: `${name?.replace(" ", "+")}@callbuddy.com`,
        amount,
        metadata: {
          id,
          minutes,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTHORIZATION_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return Response.json(res.data, {
      status: StatusCode.OK,
    });
  } catch (err: any) {
    console.log({
      err,
    });
    return Response.json(err.message, {
      status: err.statusCode || StatusCode.SERVER_ERROR,
    });
  }
}
