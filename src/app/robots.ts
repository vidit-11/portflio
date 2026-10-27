import type { MetadataRoute } from "next";

import homeContent from "@/data/home.json";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `https://${homeContent.domain}/sitemap.xml`,
  };
}
