import { updateUserMins } from "@/services";
import { StatusCode } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const jsonString = JSON.stringify(body, null, 2);

    const metadataRegex = /"metadata":\s*({[^}]*})/;
    const metadataMatch = jsonString.match(metadataRegex);

    if (metadataMatch && body.event === "charge.success") {
      const metadataString = metadataMatch[1];
      const metadata = JSON.parse(metadataString);

      await updateUserMins(metadata);
    }
    return Response.json("Transaction completed");
  } catch (err: any) {
    return Response.json(err.message, {
      status: err.statusCode || StatusCode.SERVER_ERROR,
    });
  }
}
