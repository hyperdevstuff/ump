import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";

/*
 * Paper Mono (paper.design), variable wght 100-800, OFL. The app's mono face
 * everywhere JetBrains Mono used to be — it maps to --font-app-mono, which
 * globals.css assigns to both --font-sans and --font-mono.
 */
const paperMono = localFont({
  src: "../fonts/PaperMono-Variable.woff2",
  variable: "--font-app-mono",
  weight: "100 800",
  display: "swap",
});

/*
 * Geist Sans. The second voice: mono stays the identity for headings, labels,
 * values and code, while running prose (paragraphs, descriptions, answers)
 * reads in a sans. Consumed via --font-app-sans; the landing page scopes it
 * to its prose blocks, the dashboard stays mono-first.
 */
const geistSans = Geist({
  variable: "--font-app-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sentinel",
  description: "Uptime Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${paperMono.variable} ${geistSans.variable}`}
    >
      <head>
        {/*
          Marks the document as script-capable before first paint, so CSS can
          apply entrance animations only when something is there to drive them.
          Without JS the landing page must render fully visible rather than
          stuck behind a clip-path that will never be released.
        */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: runs once, before paint, to set a class on <html>
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
