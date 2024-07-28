import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import { AuthenticationProvider, BackgroundProvider, LowTimeProvider, ModalProvider, QueryProvider, SnackbarProvider } from "@/providers";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "callbuddy",
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
        <Suspense>
          <ThemeProvider theme={theme}>
            <QueryProvider>
              <ModalProvider>
                <SnackbarProvider>
                  <AuthenticationProvider>
                    <LowTimeProvider>
                      <BackgroundProvider>
                        {children}
                      </BackgroundProvider>
                    </LowTimeProvider>
                  </AuthenticationProvider>
                </SnackbarProvider>
              </ModalProvider>
            </QueryProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
