"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Mail, MessageSquare, Send, User, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="min-h-[100dvh] font-sans flex flex-col relative z-10 text-white selection:bg-[#FFB800] selection:text-black">
      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center pt-24 sm:pt-28 md:pt-32 p-3 sm:p-6 md:p-8">
        <main className="max-w-6xl mx-auto w-full flex flex-col h-full lg:max-h-[82vh]">
          <div className="mb-3 sm:mb-6 text-center md:text-left flex-shrink-0">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight mb-1 text-white">
              Get in Touch
            </h1>
            <p className="text-gray-400 text-[10px] sm:text-sm md:text-base leading-relaxed max-w-2xl">
              Have a question or need support? Fill out the form below and our team will get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 flex-grow">
            <div className="space-y-3 md:col-span-1 flex flex-col">
              <div className="border border-white/10 bg-white/[0.02] p-3 sm:p-5 rounded-2xl flex-shrink-0 shadow-lg">
                <h3 className="text-sm sm:text-lg font-bold mb-2 sm:mb-3 text-[#FFB800]">Support Channels</h3>
                
                <div className="space-y-2 sm:space-y-4">
                  <a href="https://discord.gg/FHzr8Tss4Y" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 sm:p-3 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/20 transition-all group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#5865F2] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-[12px] sm:text-sm group-hover:text-[#5865F2] transition-colors">Discord Server</h4>
                      <p className="text-[9px] sm:text-xs text-gray-400 mt-0.5">Fastest response time</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 p-2 sm:p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-[12px] sm:text-sm">Direct Email</h4>
                      <p className="text-[9px] sm:text-xs text-gray-400 mt-0.5">contact@dynexus.space</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border border-white/10 bg-white/[0.02] p-3 sm:p-5 rounded-2xl flex-grow md:flex-grow-0 mt-2 shadow-lg">
                 <h3 className="text-xs sm:text-base font-bold mb-1 sm:mb-2 text-white">Office Hours</h3>
                 <p className="text-[10px] sm:text-sm text-gray-400 font-light leading-tight sm:leading-relaxed">
                   Our support team is active 24/7 on Discord. Direct emails typically receive a response within 24-48 hours.
                 </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="border border-white/10 bg-[#0a0a0a] p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB800]/5 rounded-full blur-[80px] pointer-events-none"></div>

                {status === "success" ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                    <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-400 text-sm mb-8 max-w-md">
                      Thank you for reaching out. We have received your message and will get back to you shortly.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 relative z-10 flex flex-col h-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
                      <div className="space-y-1 sm:space-y-1.5">
                        <label htmlFor="name" className="text-xs sm:text-sm font-medium text-gray-300 ml-1 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" /> Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800]/50 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-1 sm:space-y-1.5">
                        <label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-300 ml-1 flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" /> Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800]/50 transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-1.5 flex-shrink-0">
                      <label htmlFor="subject" className="text-xs sm:text-sm font-medium text-gray-300 ml-1 flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" /> Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800]/50 transition-all"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-1.5 flex-grow flex flex-col min-h-[120px]">
                      <label htmlFor="message" className="text-xs sm:text-sm font-medium text-gray-300 ml-1 flex items-center gap-2 flex-shrink-0">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800]/50 transition-all resize-none flex-grow"
                        placeholder="Describe your issue or inquiry in detail..."
                      ></textarea>
                    </div>

                    {status === "error" && (
                      <div className="flex items-center gap-2 text-[#EF4444] bg-[#EF4444]/10 p-2 sm:p-3 rounded-lg border border-[#EF4444]/20 text-xs sm:text-sm flex-shrink-0">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <p>{errorMessage}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full relative px-6 py-3 sm:py-3.5 bg-[#FFB800] hover:bg-[#E5A500] disabled:opacity-70 disabled:hover:bg-[#FFB800] text-black text-sm sm:text-base font-bold rounded-xl transition-all duration-150 shadow-[0_0_20px_rgba(255,184,0,0.15)] flex items-center justify-center gap-2 flex-shrink-0 mt-2"
                    >
                      {status === "loading" ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Send Message <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
