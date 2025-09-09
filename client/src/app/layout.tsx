// client/src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // 1. Import the new Footer component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crowdfunding dApp",
  description: "A decentralized crowdfunding platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        // This structure ensures the footer sticks to the bottom of the page
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}
      >
        <Navbar />
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        {/* 2. Add the Footer component here */}
        <Footer />
      </body>
    </html>
  );
}