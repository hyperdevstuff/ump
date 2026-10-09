import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-app-mono",
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
      className={`${jetbrainsMono.variable}`}
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
