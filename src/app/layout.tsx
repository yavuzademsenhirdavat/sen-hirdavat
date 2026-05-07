import type { Metadata } from "next";
import { Inter, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Şen Hırdavat — Bursa Nalbur & Hırdavat",
  description: "Bursa Osmangazi'de hırdavat, nalbur, el aletleri ve yapı malzemeleri. Online sipariş ve aynı gün teslimat.",
  keywords: "hırdavat, nalbur, bursa, el aletleri, yapı malzemeleri, vida, somun",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${manrope.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-slate-800">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
