import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";

import { brand } from "@/lib/brand";
import { AuthProvider } from "@/components/auth-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: brand.full,
    template: `%s · ${brand.short}`,
  },
  description:
    "Wings of Women organizes small hosted trips for women traveling without a companion. Register, browse tour details, and pay from your portal.",
  icons: {
    icon: "/wow-logo.png",
    apple: "/wow-logo.png",
    shortcut: "/wow-logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <AuthProvider>
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
