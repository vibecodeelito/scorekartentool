import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Script from "next/script";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const baseUrl = "https://scorekarte.ch";
  const alternates: Record<string, string> = {};
  for (const loc of routing.locales) {
    alternates[loc] = `${baseUrl}/${loc}`;
  }

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: alternates,
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `${baseUrl}/${locale}`,
      siteName: "scorekarte.ch",
      locale: locale,
      type: "website",
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "scorekarte.ch – Golf Handicap Tools",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [`${baseUrl}/images/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "scorekarte.ch",
    url: `https://scorekarte.ch/${locale}`,
    applicationCategory: "SportsApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CHF",
    },
    description:
      "Golf Handicap Calculator, Scorecard and Stableford Tools for Swiss Golfers",
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "scorekarte.ch",
    url: "https://scorekarte.ch",
    logo: "https://scorekarte.ch/images/logo.png",
  };

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        {/* Google Fonts - Inter, Montserrat, JetBrains Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&family=Montserrat:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>

        {/* Google Tag Manager - loads after page interactive */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              // Default consent mode v2
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'wait_for_update': 500
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
