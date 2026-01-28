import { headers } from "next/headers";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, updateUser, deleteUser } from "@/actions/users";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to your environment variables");
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: Invalid signature", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const result = await createUser({
      clerkId: id,
      email: email_addresses[0]?.email_address ?? "",
      name: [first_name, last_name].filter(Boolean).join(" ") || undefined,
      imageUrl: image_url ?? undefined,
    });

    if (!result.success) {
      console.error("Failed to create user:", result.error);
      return new Response("Error: Failed to create user", { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const result = await updateUser(id, {
      email: email_addresses[0]?.email_address,
      name: [first_name, last_name].filter(Boolean).join(" ") || undefined,
      imageUrl: image_url ?? undefined,
    });

    if (!result.success) {
      console.error("Failed to update user:", result.error);
      return new Response("Error: Failed to update user", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (id) {
      const result = await deleteUser(id);

      if (!result.success) {
        console.error("Failed to delete user:", result.error);
        return new Response("Error: Failed to delete user", { status: 500 });
      }
    }
  }

  return new Response("Success", { status: 200 });
}
