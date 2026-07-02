export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiToken = process.env.SENDER_API_TOKEN;

  // Default (checklist) group, plus an optional source-code group.
  // Subscribers who ask for project source code go into SENDER_GROUP_SOURCECODE
  // (set up a matching automation in Sender.net that delivers the code).
  // Until that env var is set, they fall back to the default group.
  const defaultGroup    = process.env.SENDER_GROUP_ID || "enGQp5";
  const sourceCodeGroup = process.env.SENDER_GROUP_SOURCECODE || defaultGroup;

  if (!apiToken) {
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  let email, list;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    email = (body.email || "").trim().toLowerCase();
    list  = body.list || "checklist";
  } catch (e) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  // Whitelist of allowed lists -> Sender.net group IDs
  const groups = {
    "checklist":   [defaultGroup],
    "source-code": [sourceCodeGroup, defaultGroup],
  };
  const groupIds = [...new Set(groups[list] || [defaultGroup])];

  const senderRes = await fetch("https://api.sender.net/v2/subscribers", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ email, groups: groupIds }),
  });

  if (!senderRes.ok) {
    const err = await senderRes.text();
    console.error("Sender.net error:", err);
    return res.status(502).json({ error: "Subscription failed" });
  }

  return res.status(200).json({ ok: true });
}
