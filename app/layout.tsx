import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { SpotProvider } from "@/context/SpotContext";
import { UserProvider } from "@/context/UserContext";
import { FeedProvider } from "@/context/FeedContext";
import { SessionWrapper } from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkateSpot",
  description: "Discover and share the best skate spots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground overflow-hidden`}>
        <SessionWrapper>
          <UserProvider>
            <FeedProvider>
              <SpotProvider>
                <div className="flex h-screen flex-col">
                  <Navbar />
                  <main className="flex-1 overflow-auto relative pt-16">
                    {children}
                  </main>
                </div>
              </SpotProvider>
            </FeedProvider>
          </UserProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
