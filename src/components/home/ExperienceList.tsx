import { Experience } from "@/lib/schemas";
import Link from "next/link";
import { Card } from "./Section";

export default function ExperienceList({ career }: { career: Experience[] }) {
  const roles = career.flatMap((org) =>
    org.positions.map((position) => ({ org, position })),
  );

  return (
    <Card className="p-0">
      <ol className="divide-y">
        {roles.map(({ org, position }) => (
          <li
            key={`${org.name}-${position.title}-${position.start}`}
            className="flex flex-col gap-3 p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <div>
                <h3 className="font-semibold">{position.title}</h3>
                <Link
                  href={org.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link text-sm"
                >
                  {org.name}
                </Link>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {position.start} — {position.end ?? "Present"}
              </p>
            </div>
            {position.description && (
              <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                {position.description.map((desc, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span
                      className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/60"
                      aria-hidden="true"
                    />
                    {desc}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </Card>
  );
}
