import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/terms`,
      languages: {
        "x-default": "/zh-TW/terms",
        "zh-TW": "/zh-TW/terms",
        en: "/en/terms",
      },
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Terms");

  const sections = [
    { title: t("useTitle"), content: t("useContent") },
    { title: t("ipTitle"), content: t("ipContent") },
    { title: t("availabilityTitle"), content: t("availabilityContent") },
    { title: t("limitsTitle"), content: t("limitsContent") },
    { title: t("disclaimerTitle"), content: t("disclaimerContent") },
    { title: t("changesTitle"), content: t("changesContent") },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6">
            <h1 className="font-serif text-3xl font-bold text-ink-900 md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-2 text-sm text-ink-600/60">
              {t("lastUpdated")}
            </p>

            <h2 className="mt-10 font-serif text-xl font-bold text-ink-900 md:text-2xl">
              {t("introTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-600">
              {t("introContent")}
            </p>

            {sections.map(({ title, content }) => (
              <div key={title}>
                <h2 className="mt-10 font-serif text-xl font-bold text-ink-900 md:text-2xl">
                  {title}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-600">{content}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
