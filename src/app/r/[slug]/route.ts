import { NextRequest, NextResponse } from "next/server";
import { componentRegistry } from "@/lib/component-registry";
import { promises as fs } from "fs";
import path from "path";

function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function detectDependencies(code: string): string[] {
  const deps: string[] = [];
  
  if (code.includes("framer-motion") || code.includes("motion")) {
    deps.push("framer-motion");
  }
  if (code.includes("clsx") || code.includes("cn(")) {
    deps.push("clsx", "tailwind-merge");
  }
  if (code.includes("lucide-react")) {
    deps.push("lucide-react");
  }
  if (code.includes("@react-spring")) {
    deps.push("@react-spring/web");
  }
  if (code.includes("react-use-measure")) {
    deps.push("react-use-measure");
  }
  
  if (deps.length === 0) {
    deps.push("framer-motion");
  }
  
  return [...new Set(deps)];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  const componentSlug = slug.replace(/\.json$/, "");
  
  const component = componentRegistry[componentSlug];
  
  if (component) {
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

  try {
    const registryPath = path.join(process.cwd(), "src", "registry", `${componentSlug}.tsx`);
    const code = await fs.readFile(registryPath, "utf-8");
    const dependencies = detectDependencies(code);
    
    return NextResponse.json({
      name: componentSlug,
      type: "registry:ui",
      dependencies,
      devDependencies: [],
      registryDependencies: [],
      files: [
        {
          path: `components/nonaxial/${componentSlug}.tsx`,
          content: code,
          type: "registry:ui",
          target: `components/nonaxial/${componentSlug}.tsx`,
        },
      ],
      tailwind: {},
      cssVars: {},
      meta: {
        name: slugToName(componentSlug),
        description: `${slugToName(componentSlug)} component`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Component not found" },
      { status: 404 }
    );
  }
}
