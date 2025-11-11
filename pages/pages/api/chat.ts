import type { NextApiRequest, NextApiResponse } from "next";

type Message = { role: "user" | "assistant" | "system"; content: string };

const SYSTEM_PROMPT = `
أنت مساعد عملي ودود.
- ردود قصيرة وواضحة.
- ارفض أي طلبات ضارة أو غير قانونية.
`;

const BLOCKLIST = ["اختراق", "تعطيل جهاز", "برمجيات خبيثة", "تجاوز قيود", "سرقة"];

function isBlocked(messages: Message[]) {
  const text = messages.map((m) => m.content.toLowerCase()).join(" ");
  return BLOCKLIST.some((term) => text.includes(term.toLowerCase()));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages = [] } = req.body as { messages: Message[] };

  if (isBlocked(messages)) {
    return res.status(200).json({
      reply: "🚫 لا يمكنني المساعدة في طلبات غير آمنة."
    });
  }

  const last = messages[messages.length - 1]?.content || "";
  const reply = `💡 تمام، طلبك: "${last}". حدّد الهدف بدقة وسأعطيك كود جاهز.`;

  return res.status(200).json({ reply });
}
