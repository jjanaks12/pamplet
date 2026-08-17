import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nepali Congress poster generator",
  description: "Add your photo, name, and position to the poster and download it as a PNG.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="flex items-center gap-3 border-b border-zinc-200 bg-white px-6 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/flag-removebg-preview.png" alt="Nepali Congress flag" className="h-8 w-auto" />
          <span className="text-lg font-semibold text-zinc-800">Nepali Congress</span>
        </header>

        <div className="flex flex-1 flex-col">{children}</div>

        <footer className="flex items-center justify-center gap-2 border-t border-zinc-200 bg-white px-6 py-4 text-sm text-zinc-500">
          <span>Developed by</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/letslearn-new-logo.webp" alt="LetsLearn" className="h-5 w-auto" />
        </footer>
      </body>
    </html>
  );
}
