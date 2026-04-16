import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const apiToken = import.meta.env.SENDER_API_TOKEN;
  const groupId  = import.meta.env.SENDER_GROUP_ID ?? "enGQp5";

  if (!apiToken) {
    return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let email: string;
  try {
    const body = await request.json();
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: "Invalid email address" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const senderRes = await fetch("https://api.sender.net/v2/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, groups: [groupId] }),
  });

  if (!senderRes.ok) {
    const err = await senderRes.text();
    console.error("Sender.net error:", err);
    return new Response(JSON.stringify({ error: "Subscription failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
