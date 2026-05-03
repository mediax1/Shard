"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

const FAQ_QUESTIONS = [
  {
    q: "How do I earn free credits?",
    a: "You can claim free credits daily by spinning the wheel on the 'Earn Credits' page in your dashboard. You can also purchase them in the Store.",
  },
  {
    q: "Can I host Python bots?",
    a: "Absolutely! We support both Node.js and Python. You can select your preferred environment when deploying a new server.",
  },
  {
    q: "What happens when my server expires?",
    a: "Your server will be suspended to save resources. You'll have a 7-day grace period to renew it using credits before it is permanently deleted.",
  },
];

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi there! 👋 Welcome to Dynexus Support. How can I help you today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  const handleQuestionClick = (qIndex: number) => {
    const faq = FAQ_QUESTIONS[qIndex];

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", text: faq.q },
    ]);

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: "bot", text: faq.a },
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <div
        className={`
          mb-4 overflow-hidden flex flex-col
          bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl
          shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(255,184,0,0.05)]
          transition-all duration-300 origin-bottom-right
          ${isOpen
            ? "opacity-100 scale-100 w-[320px] md:w-[360px] h-[450px]"
            : "opacity-0 scale-50 w-[320px] md:w-[360px] h-[450px] pointer-events-none absolute bottom-16 right-0"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-gradient-to-r from-[#141414] to-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB800] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFB800]"></span>
            </div>
            <div>
              <h3 className="text-white font-black tracking-wide text-sm">
                Dynexus Support
              </h3>
              <p className="text-[#FFB800] text-[9px] font-bold tracking-widest uppercase mt-0.5">
                AI Assistant
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-hide">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {msg.sender === "bot" && (
                <div className="w-6 h-6 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center mr-2 shrink-0 mt-1">
                  <svg
                    className="w-3.5 h-3.5 text-[#FFB800]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              )}
              <div
                className={`
                max-w-[85%] px-4 py-3 text-sm leading-relaxed
                ${msg.sender === "user"
                    ? "bg-[#FFB800] text-black font-semibold rounded-2xl rounded-tr-sm shadow-[0_4px_15px_rgba(255,184,0,0.2)]"
                    : "bg-[#18181b] text-gray-200 border border-white/5 rounded-2xl rounded-tl-sm shadow-inner"
                  }
              `}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="w-6 h-6 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center mr-2 shrink-0 mt-1">
                <svg
                  className="w-3.5 h-3.5 text-[#FFB800]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="bg-[#18181b] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-4 flex items-center gap-1.5 w-16">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* FAQ Options (Input Area) */}
        <div className="p-4 border-t border-white/5 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 px-1">
            Suggested Questions
          </p>
          <div className="flex flex-col gap-2">
            {FAQ_QUESTIONS.map((faq, idx) => (
              <button
                key={idx}
                onClick={() => handleQuestionClick(idx)}
                disabled={isTyping}
                className="text-left px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#FFB800]/40 transition-all text-xs text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed group/btn"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{faq.q}</span>
                  <svg
                    className="w-3.5 h-3.5 text-gray-600 group-hover/btn:text-[#FFB800] transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ))}

            {/* Discord Support Button */}
            <a
              href="https://discord.gg/wgXgZ4BfbH"
              target="_blank"
              rel="noopener noreferrer"
              className="text-left px-4 py-2.5 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 hover:border-[#5865F2]/60 transition-all text-xs text-white group/discord flex items-center justify-between mt-1"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
                <span className="font-bold text-[#5865F2] group-hover/discord:text-white transition-colors">Join Discord For Support</span>
              </div>
              <svg className="w-3.5 h-3.5 text-[#5865F2] group-hover/discord:text-white group-hover/discord:translate-x-0.5 group-hover/discord:-translate-y-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center p-2 cursor-pointer transition-all duration-300 active:scale-95"
        aria-label="Toggle Support Chat"
      >
        {isOpen ? (
          <svg
            className="w-7 h-7 text-gray-400 hover:text-white transition-colors duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-8 h-8 text-gray-400 group-hover:text-[#facc15] transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
