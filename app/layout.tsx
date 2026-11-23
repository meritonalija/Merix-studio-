import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
 title: "MERIX STUDIO | Web Development & Digital Solutions",
 description: "MERIX STUDIO — zhvillim webfaqesh profesionale, aplikacione biznesi dhe zgjidhje digjitale në Maqedoninë e Veriut.",
 applicationName: "MERIX STUDIO",
 robots: { index: true, follow: true },
 openGraph: { title: "MERIX STUDIO — Digital Solutions", description: "Websites with character. Software that solves real problems.", type: "website", siteName: "MERIX STUDIO" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#080b18" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="sq"><body>{children}</body></html>; }
