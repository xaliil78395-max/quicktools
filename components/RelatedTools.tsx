"use client";

import Link from "next/link";
import { relatedTools } from "@/lib/relatedTools";

type RelatedToolsProps = {
  currentTool: string;
};

export default function RelatedTools({ currentTool }: RelatedToolsProps) {
  const tools = relatedTools[currentTool] ?? [];

  if (tools.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 border-t pt-8">
      <h2 className="mb-4 text-xl font-semibold">Related Tools</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-lg border bg-background p-4 transition hover:bg-muted"
          >
            <span className="text-sm font-medium">{tool.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
