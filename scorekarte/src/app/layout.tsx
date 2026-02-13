import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "scorekarte.ch",
  description: "Golf Handicap Tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
