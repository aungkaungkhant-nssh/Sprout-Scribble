import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/navigation/nav";
import { cn } from "@/lib/utils";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
  profile: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn("px-6 md:px-24")}
      >
        <Nav />
        {children}
        {/* {isAdmin && profile} */}
      </body>
    </html>
  );
}
