import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://neatoolkit.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The [locale] layout handles <html> and <body> tags.
  // This root layout just imports global CSS and passes children through.
  return children;
}
