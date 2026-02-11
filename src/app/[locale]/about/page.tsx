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
  const t = await getTranslations({ locale, namespace: "About" });

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        "zh-TW": "/zh-TW/about",
        en: "/en/about",
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("About");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6">
            <h1 className="font-serif text-3xl font-bold text-ink-900 md:text-4xl">
              {t("title")}
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-ink-600">
              {t("intro")}
            </p>

            <h2 className="mt-12 font-serif text-xl font-bold text-ink-900 md:text-2xl">
              {t("whyTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-600">
              {t("whyContent")}
            </p>

            <h2 className="mt-12 font-serif text-xl font-bold text-ink-900 md:text-2xl">
              {t("howTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-600">
              {t("howContent")}
            </p>

            <h2 className="mt-12 font-serif text-xl font-bold text-ink-900 md:text-2xl">
              {t("whoTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-600">
              {t("whoContent")}
            </p>

            <p className="mt-6 text-ink-600">
              {t("contactLabel")}:{" "}
              <a
                href={`mailto:${t("contactEmail")}`}
                className="text-link hover:text-link-hover"
              >
                {t("contactEmail")}
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
