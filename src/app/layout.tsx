import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import { I18nProvider } from "@/lib/i18n/use-i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Muhammad Umer – Software Engineer Portfolio",
  description: "Professional portfolio for Muhammad Umer, showcasing backend, cloud, React, and blockchain projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <a
          href="#mu-global__layout__section--main"
          id="mu-global__layout__link--skip-to-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-background"
        >
          Skip to main content
        </a>
        <I18nProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main
              id="mu-global__layout__section--main"
              className="flex-1 bg-background text-foreground"
            >
              {children}
            </main>
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
