import type { MetadataRoute } from "next";

import homeContent from "@/data/home.json";
import routesData from "@/data/routes.json";

export default function sitemap(): MetadataRoute.Sitemap {
  return routesData.routes
    .filter((route) => route.showInNav)
    .map((route) => ({
      url: `https://${homeContent.domain}${route.path}`,
      lastModified: new Date(),
    }));
}
