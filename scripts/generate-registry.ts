import * as fs from "fs";
import * as path from "path";

const REGISTRY_DIR = path.join(process.cwd(), "src", "registry");
const OUTPUT_FILE = path.join(process.cwd(), "src", "lib", "component-registry.ts");

function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function detectDependencies(code: string): string[] {
  const deps: string[] = [];

  if (code.includes("framer-motion") || code.includes('from "framer-motion"') || code.includes("motion.")) {
    deps.push("framer-motion");
  }
  if (code.includes("clsx") || code.includes('cn(')) {
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

function escapeCode(code: string): string {
  return code.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function extractDescription(code: string, slug: string): string {
  const jsdocMatch = code.match(/\/\*\*[\s\S]*?\*\//);
  if (jsdocMatch) {
    const descMatch = jsdocMatch[0].match(/@description\s+(.+)/);
    if (descMatch) {
      return descMatch[1].trim();
    }
    const lines = jsdocMatch[0].split("\n").filter((l) => l.includes("*") && !l.includes("/**") && !l.includes("*/"));
    if (lines.length > 0) {
      const firstLine = lines[0].replace(/^\s*\*\s*/, "").trim();
      if (firstLine && !firstLine.startsWith("@")) {
        return firstLine;
      }
    }
  }

  return `${slugToName(slug)} component`;
}

async function generateRegistry() {
  console.log("Scanning registry folder...");

  const files = fs.readdirSync(REGISTRY_DIR).filter((f) => f.endsWith(".tsx"));

  console.log(`Found ${files.length} component files`);

  const entries: string[] = [];

  for (const file of files) {
    const slug = file.replace(/\.tsx$/, "");
    const filePath = path.join(REGISTRY_DIR, file);
    const code = fs.readFileSync(filePath, "utf-8");
    const dependencies = detectDependencies(code);
    const description = extractDescription(code, slug);
    const name = slugToName(slug);

    const entry = `  "${slug}": {
    name: "${name}",
    description: "${description}",
    dependencies: ${JSON.stringify(dependencies)},
    code: \`${escapeCode(code)}\`,
  }`;

    entries.push(entry);
    console.log(`  - ${slug}`);
  }

  const output = `// Auto-generated file - DO NOT EDIT MANUALLY
// Run: npx tsx scripts/generate-registry.ts

interface ComponentRegistryItem {
  name: string;
  description: string;
  code: string;
  dependencies?: string[];
  registryDependencies?: string[];
  tailwind?: Record<string, unknown>;
  cssVars?: Record<string, unknown>;
}

export const componentRegistry: Record<string, ComponentRegistryItem> = {
${entries.join(",\n")}
};
`;

  fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
  console.log(`\nGenerated ${OUTPUT_FILE} with ${files.length} components`);
}

generateRegistry().catch(console.error);
