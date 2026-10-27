"use client";

import { Diagram } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ArchDiagram from "./ArchDiagram";

interface Props {
  name: string;
  architecture?: Diagram;
  pipeline?: Diagram;
}

// Shows the architecture diagram, with a tab for the CI/CD flow when a project has one
export default function ProjectDiagrams({
  name,
  architecture,
  pipeline,
}: Props) {
  const tabs = [
    architecture && {
      key: "architecture",
      label: "Architecture",
      diagram: architecture,
    },
    pipeline && { key: "pipeline", label: "CI/CD pipeline", diagram: pipeline },
  ].filter((t): t is { key: string; label: string; diagram: Diagram } => !!t);
  const [active, setActive] = useState(tabs[0]?.key);

  if (tabs.length === 0) return null;
  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div>
      {tabs.length > 1 && (
        <div
          className="flex gap-1 border-b px-3 pt-2"
          role="tablist"
          aria-label={`${name} diagrams`}
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={t.key === current.key}
              onClick={() => setActive(t.key)}
              className={cn(
                "-mb-px border-b-2 px-3 py-2 text-xs font-medium transition-colors",
                t.key === current.key
                  ? "border-brand text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      <ArchDiagram
        key={current.key}
        architecture={current.diagram}
        name={name}
      />
    </div>
  );
}
