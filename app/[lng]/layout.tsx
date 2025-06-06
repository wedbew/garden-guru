import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { dir } from 'i18next';
import { languages, fallbackLng } from '../i18n/settings';
import { useTranslation as getServerTranslation } from '../i18n';
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type LanguageParams = {
  lng: string;
};

// Helper function to resolve language with proper typing
async function resolveLng(rawParams: Promise<LanguageParams> | LanguageParams): Promise<string> {
  const params = await Promise.resolve(rawParams);
  return languages.includes(params.lng) ? params.lng : fallbackLng;
}

export async function generateStaticParams(): Promise<LanguageParams[]> {
  return languages.map((lng) => ({ lng }));
}

export async function generateMetadata(props: {
  params: Promise<LanguageParams>;
}): Promise<Metadata> {
  const lng = await resolveLng(props.params);
  const { t } = await getServerTranslation(lng);
  
  return {
    title: {
      template: '%s | ' + t('meta.title'),
      default: t('meta.title'),
    },
    description: t('meta.description'),
    metadataBase: new URL('https://your-site.com'),
  };
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<LanguageParams>;
}) {
  const lng = await resolveLng(props.params);
  // const { t } = await getServerTranslation(lng);

  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {props.children}
        </Providers>
      </body>
    </html>
  );
}