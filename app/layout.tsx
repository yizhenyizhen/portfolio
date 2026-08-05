import type { Metadata } from "next";
import { I18nProvider } from "@/components/systems/i18n";
import { siteMetadata } from "@/data/site/metadata";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/request";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return {
    metadataBase: new URL(siteMetadata.url),
    title: {
      default: siteMetadata.title,
      template: `%s | ${siteMetadata.title}`,
    },
    description:
      locale === "en"
        ? siteMetadata.description
        : messages.metadata.siteDescription,
    applicationName: siteMetadata.title,
    keywords: [...siteMetadata.keywords],
    alternates: {
      canonical: locale === "en" ? "/" : "/zh",
      languages: { en: "/", "zh-CN": "/zh" },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
