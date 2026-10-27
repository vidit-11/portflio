import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

import homeContent from "@/data/home.json";

// Fonts are bundled from npm (@fontsource-variable) instead of next/font/google,
// so builds don't depend on reaching Google Fonts
const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});
const jetbrainsMono = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-mono",
  weight: "100 800",
  display: "swap",
});

const title = `${homeContent.name} | ${homeContent.role}`;
const description =
  "Vidit Singh Chauhan, DevOps engineer in Ahmedabad. Kubernetes, CI/CD, GitOps and monitoring.";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${homeContent.domain}`),
  title: {
    default: title,
    template: `%s | ${homeContent.name}`,
  },
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: homeContent.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "flex min-h-screen flex-col bg-background font-sans antialiased",
          inter.variable,
          jetbrainsMono.variable,
        )}
      >
        <Providers>
          <Header />
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-6">
            <main className="grow">{children}</main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
