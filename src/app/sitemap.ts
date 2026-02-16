import { MetadataRoute } from "next";
import { components } from "@/lib/components-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nonaxial.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/components`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Dynamic component pages
  const componentPages: MetadataRoute.Sitemap = components.map((component) => ({
    url: `${baseUrl}/components/${component.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...componentPages];
}
