import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_PROJECT_NAME ?? "VANYOU Cargo Solutions Inc.",
  description: process.env.NEXT_PUBLIC_PROJECT_DESCRIPTION ?? "Warehouse, local logistics, and cargo support in the Vancouver area.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
