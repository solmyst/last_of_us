import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import Cursor from "@/components/cursor";
import AmbientBackground from "@/components/ambient-background";
import { ThemeProvider } from "@/components/theme-provider";
import LoadingScreen from "@/components/loading-screen";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains-mono",
  display: "swap"
});

// Assuming we don't have Fragment Mono locally yet, we'll use a fallback monospace for display
// You can replace this later by adding next/font/google config for Fragment Mono 
// when it's available or by adding the local font file.
// For now, mapping it to JetBrains Mono to prevent errors, but you can adjust.
const fragmentMono = {
  className: jetbrainsMono.className,
  style: { fontFamily: 'var(--font-jetbrains-mono)' },
  variable: '--font-fragment-mono'
};

export const metadata: Metadata = {
  metadataBase: new URL('https://anushgupta.tech'),
  title: "Anush Gupta — Product Manager & Full-Stack Builder",
  description: "Product manager with four Park+ internships and an engineering background. User research, funnel optimization, and AI products built end to end.",
  alternates: {
    canonical: 'https://anushgupta.tech',
  },
  openGraph: {
    title: "Anush Gupta — Product Manager & Full-Stack Builder",
    description: "Product manager with four Park+ internships and an engineering background. User research, funnel optimization, and AI products built end to end.",
    url: "https://anushgupta.tech",
    siteName: "Anush Gupta Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Anush Gupta — Product Manager & Full-Stack Builder",
    description: "Product manager with four Park+ internships and an engineering background. User research, funnel optimization, and AI products built end to end.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${fragmentMono.variable} antialiased text-text-primary bg-bg-base overflow-x-hidden transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LoadingScreen />
          <AmbientBackground />
          {children}
          <Cursor />
        </ThemeProvider>
      </body>
    </html>
  );
}
