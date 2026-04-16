export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiToken = process.env.SENDER_API_TOKEN;
  const groupId  = process.env.SENDER_GROUP_ID || "enGQp5";

  if (!apiToken) {
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  let email;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    email = (body.email || "").trim().toLowerCase();
  } catch (e) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const senderRes = await fetch("https://api.sender.net/v2/subscribers", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ email, groups: [groupId] }),
  });

  if (!senderRes.ok) {
    const err = await senderRes.text();
    console.error("Sender.net error:", err);
    return res.status(502).json({ error: "Subscription failed" });
  }

  return res.status(200).json({ ok: true });
}
