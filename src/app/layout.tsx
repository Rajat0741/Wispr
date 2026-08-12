import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/toast";
import { Provider } from "../lib/providers/provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Convo",
  description: "A focused space for conversations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-svh flex flex-col overflow-hidden">
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
