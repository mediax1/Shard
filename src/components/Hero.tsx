"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function Hero() {
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const handleStart = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    router.push(token ? "/panel" : "/login");
  };

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden font-sans flex flex-col ">
      <Navbar />
      <div className="w-full flex-grow md:w-[125%] md:h-[125%] origin-top-left scale-100 md:scale-[0.8] text-white flex flex-col justify-center relative"
        style={{ paddingTop: '0px' }}
      >
        <div className="absolute left-3 sm:left-10 md:left-16 bottom-20 md:bottom-28 hidden sm:flex flex-col gap-3 md:gap-4 z-20">
          <a href="https://www.instagram.com/thedynexus?igsh=MXZreTJxNGtsaXlraw==" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-[#e0e0e0] flex items-center justify-center hover:scale-110 hover:bg-white transition-all shadow-lg">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-black" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
          </a>
          <a href="https://discord.gg/wgXgZ4BfbH" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-[#e0e0e0] flex items-center justify-center hover:scale-110 hover:bg-white transition-all shadow-lg">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-black" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" /></svg>
          </a>
          {/* <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-[#e0e0e0] flex items-center justify-center hover:scale-110 hover:bg-white transition-all shadow-lg">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          </a> */}
        </div>

        <div className="absolute right-3 sm:right-10 md:right-18 bottom-20 md:bottom-28 hidden sm:flex flex-col items-center gap-3 md:gap-4 z-20  ">
          <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-[#e0e0e0] flex items-center justify-center hover:scale-110 hover:bg-white transition-all shadow-lg p-1 sm:p-1.5 md:p-2">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python" className="w-full h-full object-contain" />
          </a>
          <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-[#e0e0e0] flex items-center justify-center hover:scale-110 hover:bg-white transition-all shadow-lg p-1 sm:p-1.5 md:p-2">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-full h-full object-contain" />
          </a>
          <div className="relative flex flex-col items-center">
            <button
              onClick={() => setShowMore(!showMore)}
              className="flex gap-1 md:gap-1.5 mt-1 md:mt-2 py-1 md:py-2 cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="More"
            >
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white"></div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white"></div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white"></div>
            </button>

            {showMore && (
              <div className="absolute top-full mt-2 right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 whitespace-nowrap bg-[#111] text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-white/10 shadow-xl text-gray-300">
                More coming soon...
              </div>
            )}
          </div>
        </div>


        <main className=
          "flex flex-col items-center relative z-10 px-4 w-full max-w-7xl mx-auto pb-4 md:pb-8 pt-24 md:pt-75">

          <div className="flex items-center justify-center gap-0 md:gap-6 w-full mb-0 z-10 ">
            <div className="w-28 sm:w-40 md:w-[200px] h-[28vh] sm:h-[28vh] min-h-[160px] md:min-h-[220px] lg:min-h-[280px] max-h-[380px] rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl relative overflow-hidden flex-shrink-0 -mr-16 sm:-mr-8 md:mr-0 z-0 opacity-60 sm:opacity-80 md:opacity-100 scale-90 md:scale-100 transition-all duration-500">
              <img src="/images/discord-hand.png" alt="Discord Bot" className="w-full h-full object-cover" />
            </div>

            <div className="w-40 sm:w-52 md:w-[250px] h-[30vh] sm:h-[34vh] min-h-[180px] md:min-h-[230px] lg:min-h-[290px] max-h-[380px] rounded-2xl bg-black border border-white/20 shadow-[0_0_40px_rgba(0,0,0,1)] relative overflow-hidden flex-shrink-0 z-10 transition-all duration-500">
              <img src="/images/discord-hand.png" alt="Discord Bot" className="w-full h-full object-cover" />
            </div>

            <div className="w-28 sm:w-40 md:w-[200px] h-[28vh] sm:h-[28vh] min-h-[100px] md:min-h-[220px] lg:min-h-[280px] max-h-[380px] rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl relative overflow-hidden flex-shrink-0 -ml-16 sm:-ml-8 md:ml-0 z-0 opacity-60 sm:opacity-80 md:opacity-100 scale-90 md:scale-100 transition-all duration-500">
              <img src="/images/discord-hand.png" alt="Discord Bot" className="w-full h-full object-cover" />
            </div>
          </div>

          <button
            onClick={handleStart}
            className="relative px-8 md:px-12 py-2 md:py-3 bg-[#FFB800] hover:bg-[#E5A500] text-black text-lg md:text-xl font-bold rounded-xl transition-colors duration-150 z-20 shadow-[0_0_25px_rgba(255,184,0,0.25)] -mt-4 md:-mt-6"
          >
            Start for free
          </button>

          <div className="text-center mt-3 sm:mt-4 md:mt-6 max-w-2xl mx-auto space-y-1 md:space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight px-2">
              Keep your bot <span className="text-[#FFB800]">alive.</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-base md:text-lg font-light tracking-[1px] md:tracking-[3px] leading-snug max-w-[17rem] sm:max-w-md mx-auto">
              Simple, affordable hosting built<br />
              for Discord bots. Deploy in seconds,<br />
              forget about downtime.
            </p>
          </div>

          <div className="flex justify-center flex-wrap gap-6 sm:gap-12 md:gap-24 mt-3 sm:mt-5 md:mt-8 text-center px-4">
            <div>
              <h3 className="text-white font-bold text-xl sm:text-2xl md:text-3xl">$0</h3>
              <p className="text-gray-500 text-[10px] sm:text-sm mt-0.5 sm:mt-1">to start</p>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl sm:text-2xl md:text-3xl">99.9%</h3>
              <p className="text-gray-500 text-[10px] sm:text-sm mt-0.5 sm:mt-1">uptime</p>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl sm:text-2xl md:text-3xl">&lt;1 min</h3>
              <p className="text-gray-500 text-[10px] sm:text-sm mt-0.5 sm:mt-1">deploy time</p>
            </div>
          </div>

          <div className="flex sm:hidden flex-col items-center justify-center gap-3 mt-4 mb-2 w-full z-20 ">
            <div className="flex flex-row gap-6 items-center">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#e0e0e0] flex items-center justify-center hover:scale-110 hover:bg-white transition-all shadow-lg shrink-0">
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#e0e0e0] flex items-center justify-center hover:scale-110 hover:bg-white transition-all shadow-lg shrink-0">
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" /></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#e0e0e0] flex items-center justify-center hover:scale-110 hover:bg-white transition-all shadow-lg shrink-0">
                <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            </div>

            <div className="flex flex-row gap-6 items-center relative mt-1">
              <a href="#" className="w-8 h-8 rounded-full bg-[#e0e0e0] flex items-center justify-center hover:scale-110 hover:bg-white transition-all shadow-lg p-1.5 shrink-0">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python" className="w-full h-full object-contain" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#e0e0e0] flex items-center justify-center hover:scale-110 hover:bg-white transition-all shadow-lg p-1.5 shrink-0">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-full h-full object-contain" />
              </a>
              <div className="relative">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="flex gap-1 py-1 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </button>
                {showMore && (
                  <div className="absolute top-full mt-2 right-0 whitespace-nowrap bg-[#111] text-[10px] px-2 py-1 rounded-lg border border-white/10 shadow-xl text-gray-300">
                    More coming soon...
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

    </div>
  );
}
