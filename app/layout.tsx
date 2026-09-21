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
  title: "QuickHub - Free Online Tools",
  description:
    "QuickHub provides fast, simple and free online tools for images, text, developers, PDFs, calculations and everyday tasks.",
  icons: { icon: "/quicktools-favicon.png" },
  other: {
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6769649655859038" crossOrigin="anonymous"></script>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}



