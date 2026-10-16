import type { Metadata } from "next";
import { Noto_Serif_TC, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const song = Noto_Serif_TC({
  subsets: ["latin"],
  variable: "--font-song",
  display: "swap",
  weight: ["400", "700"],
});

const hei = Noto_Sans_TC({
  subsets: ["latin"],
  variable: "--font-hei",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "三國蝴蝶 - 三國歷史文字冒險遊戲",
  description: "穿越時空的蝴蝶，在三國亂世中做出你的選擇。每一個決定，都會改變歷史的走向。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" className={`${song.variable} ${hei.variable}`}>
      <body className="min-h-screen bg-ink-950 text-ink-100">
        {children}
      </body>
    </html>
  );
}
