import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flashlink | Anonymous URL Shortener",
  description: "Shorten any URL instantly with random links built for fast sharing."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

