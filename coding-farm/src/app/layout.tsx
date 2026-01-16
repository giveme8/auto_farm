// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { AlertProvider } from "../components/AlertProvider"; // Adjust the path as needed
import { ConfirmProvider } from "@/components/ConfirmProvider";
import { ConsoleProvider } from "@/components/Console/Console";
import { I18nProvider } from "@/components/I18nProvider";
import { defaultLocale, translate } from "@/i18n/core";
export const metadata: Metadata = {
  title: translate(defaultLocale, "app.title"),
  description: translate(defaultLocale, "app.description"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={defaultLocale}>
      <body>
        <I18nProvider>
          <AlertProvider>
            <ConfirmProvider>
              <ConsoleProvider>{children}</ConsoleProvider>
            </ConfirmProvider>
          </AlertProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
