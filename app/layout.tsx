import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import { ModalProvider } from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jerkbuddy",
  description: "Enjoy Seamless 1-on-1 Video Calls with Your Online Buddy and experience crystal-clear, lag-free video calls with your online buddy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <ModalProvider>
            {children}
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
