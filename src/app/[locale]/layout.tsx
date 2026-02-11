import type { Metadata } from "next";
import Script from "next/script";
import { hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { Newsreader, Noto_Sans_TC } from "next/font/google";
import { routing } from "@/i18n/routing";

const GA_MEASUREMENT_ID = "G-ZTE1LQFM2Q";

const satoshi = localFont({
  src: [
    { path: "../../../public/fonts/satoshi-400.woff2", weight: "400" },
    { path: "../../../public/fonts/satoshi-500.woff2", weight: "500" },
    { path: "../../../public/fonts/satoshi-700.woff2", weight: "700" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL("https://neatoolkit.com"),
    title: t("siteTitle"),
    description: t("siteDescription"),
    openGraph: {
      type: "website",
      siteName: "Neatoolkit",
      locale: locale === "zh-TW" ? "zh_TW" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        <meta name="google-site-verification" content="Ov5HY7PsGC3RY_L-U9YKGiueHZlXOkaL43_abfbzxx4" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Script
          src="https://umami.livelystone-ee11a8ed.japaneast.azurecontainerapps.io/script.js"
          data-website-id="b660106e-893b-433a-b62e-8cda66940c23"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${satoshi.variable} ${notoSansTC.variable} ${newsreader.variable} antialiased`}
      >
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
