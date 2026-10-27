"use client";

import { Project } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { ChaosTarget } from "../chaos/Chaos";
import ProjectCard from "./ProjectCard";

const ALL = "All";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(ALL);

  // Only offer tags shared by 2+ projects, most common first
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) =>
      p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)),
    );
    return Array.from(counts)
      .filter(([, n]) => n > 1)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([t]) => t);
  }, [projects]);

  const filtered =
    active === ALL ? projects : projects.filter((p) => p.tags.includes(active));

  return (
    <div className="flex flex-col gap-6">
      {tags.length > 0 && (
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by tag"
        >
          {[ALL, ...tags].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActive(tag)}
              aria-pressed={active === tag}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                active === tag
                  ? "border-foreground bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((project) => (
          <ChaosTarget
            key={project.name}
            pod={project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
          >
            <ProjectCard project={project} showImage />
          </ChaosTarget>
        ))}
      </div>
    </div>
  );
}
