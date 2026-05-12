import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import Cursor from "@/components/cursor";

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
  title: "Anush Gupta — Full Stack Engineer & Product Manager",
  description: "B.Tech CSE student building full-stack systems and thinking in user flows. Spring Boot, Next.js, LLMs. Open to SDE internships and full-time roles.",
  openGraph: {
    title: "Anush Gupta — sol.dev",
    description: "Full Stack Engineer & Product Manager",
    url: "https://solmyst.dev",
    siteName: "Anush Gupta Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
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
        className={`${inter.variable} ${jetbrainsMono.variable} ${fragmentMono.variable} antialiased text-text-primary bg-bg-base overflow-x-hidden`}
      >
        {children}
        <Cursor />
      </body>
    </html>
  );
}
