import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NoiseBg from "@/components/NoiseBg";
import SupportWidget from "@/components/SupportWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shard.dynexus.space"),
  title: "Shard | 24/7 Hosting",
  description:
    "Simple, affordable hosting built for Discord bots. Deploy in seconds, forget about downtime.",
  openGraph: {
    title: "Shard | 24/7 Hosting",
    description:
      "Simple, affordable hosting built for Discord bots. Deploy in seconds, forget about downtime.",
    images: [
      {
        url: "/images/image.png",
        width: 1080,
        height: 1080,
        alt: "Shard — 24/7 Discord Bot Hosting",
      },
    ],
    type: "website",
    siteName: "Shard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shard | 24/7 Hosting",
    description:
      "Simple, affordable hosting built for Discord bots. Deploy in seconds, forget about downtime.",
    images: ["/images/image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">
        <NoiseBg />
        {children}
        <SupportWidget />
      </body>
    </html>
  );
}