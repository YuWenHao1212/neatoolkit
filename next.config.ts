import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      "https://neatoolkit-api.livelystone-ee11a8ed.japaneast.azurecontainerapps.io",
  },
};

export default withNextIntl(nextConfig);
