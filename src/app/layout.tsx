import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Şen Hırdavat — Bursa Nalbur & Hırdavat",
  description: "Bursa Osmangazi'de hırdavat, nalbur, el aletleri ve yapı malzemeleri. Online sipariş ve aynı gün teslimat.",
  keywords: "hırdavat, nalbur, bursa, el aletleri, yapı malzemeleri, vida, somun",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={geist.variable}>
      <body className="min-h-screen flex flex-col bg-gray-50">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
