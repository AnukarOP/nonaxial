import { Metadata } from "next";
import { components } from "@/lib/components-data";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const component = components.find((c) => c.slug === slug);

  if (!component) {
    return {
      title: "Component Not Found",
    };
  }

  return {
    title: component.name,
    description: component.description,
    keywords: [
      component.name.toLowerCase(),
      component.category.toLowerCase(),
      ...component.tags,
      "react component",
      "animated",
      "tailwind css",
    ],
    openGraph: {
      title: `${component.name} - nonaxial`,
      description: component.description,
      url: `https://nonaxial.com/components/${slug}`,
      siteName: "nonaxial",
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${component.name} - nonaxial`,
      description: component.description,
    },
    alternates: {
      canonical: `https://nonaxial.com/components/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return components.map((component) => ({
    slug: component.slug,
  }));
}

export default function ComponentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
