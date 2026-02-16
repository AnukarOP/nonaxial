import { NextRequest, NextResponse } from "next/server";
import { componentRegistry } from "@/lib/component-registry";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  // Remove .json extension if present
  const componentSlug = slug.replace(/\.json$/, "");
  
  const component = componentRegistry[componentSlug];
  
  if (!component) {
    return NextResponse.json(
      { error: "Component not found" },
      { status: 404 }
    );
  }

  // Return shadcn-compatible JSON format
  return NextResponse.json({
    name: componentSlug,
    type: "registry:ui",
    dependencies: component.dependencies || ["framer-motion"],
    devDependencies: [],
    registryDependencies: component.registryDependencies || [],
    files: [
      {
        path: `components/nonaxial/${componentSlug}.tsx`,
        content: component.code,
        type: "registry:ui",
        target: `components/nonaxial/${componentSlug}.tsx`,
      },
    ],
    tailwind: component.tailwind || {},
    cssVars: component.cssVars || {},
    meta: {
      name: component.name,
      description: component.description,
    },
  });
}
