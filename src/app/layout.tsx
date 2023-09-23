import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rise Finance",
  description: "Trade Onchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scrollbar-hide">
      {/* <body className={inter.className}>{children}</body> */}
      <body className="h-screen bg-gray-900 sm:bg-gray-800">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
