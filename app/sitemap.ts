import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "ht" + "tps://quickhub.world";

  const toolsDir = path.join(process.cwd(), "app", "tools");
  const toolFolders = fs
    .readdirSync(toolsDir, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);

  const toolUrls: MetadataRoute.Sitemap = toolFolders.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/terms`, lastModified: new Date() },
  ];

  return [...staticUrls, ...toolUrls];
}
