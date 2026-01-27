import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContractFlow - Goal-Centered Contract Design",
  description: "Create intelligent contracts that align with your business goals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-gradient-subtle">
          {children}
        </div>
      </body>
    </html>
  );
}
