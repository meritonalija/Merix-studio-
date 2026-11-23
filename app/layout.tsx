import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "MERIX STUDIO — Digital Experiences", description: "Premium websites, software and digital solutions. MERIX STUDIO." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="sq"><body>{children}</body></html>; }
