import type { MetadataRoute } from "next";
import { collections } from "@/data/gallery";
import { site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/work/",
    "/design-library/",
    "/about/",
    "/contact/",
    ...collections.map((c) => `/collections/${c.slug}/`),
  ];
  return paths.map((path) => ({
    url: new URL(path, site.url).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
