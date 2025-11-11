import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("dir", "rtl");
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    if (!input.trim()) return;
    const userMsg: Msg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "حدث خطأ مؤقت. جرّب لاحقًا." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <header className="p-5 border-b bg-white shadow">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-pink-600">💖 منصة ذكاء اصطناعي</h1>
          <div className="text-xs text-gray-500">نسخة جاهزة</div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto p-6">
        <div className="bg-white border rounded-lg shadow">
          <div ref={listRef} className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    m.role === "user" ? "bg-pink-500 text-white" : "bg-purple-100 text-purple-900"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-500 text-sm">… جاري توليد الرد</div>}
          </div>

          <div className="p-4 border-t space-y-2">
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded px-3 py-2 focus:outline-pink-400"
                placeholder="اكتب رسالتك..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button onClick={send} className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
                إرسال
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
