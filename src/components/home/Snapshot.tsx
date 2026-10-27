import { Experience } from "@/lib/schemas";
import Link from "next/link";
import { Card } from "./Section";

import homeContent from "@/data/home.json";

interface Props {
  career: Experience[];
  stats: { title: string; value: string; note: string }[];
}

// Current role plus a few headline numbers
export default function Snapshot({ career, stats }: Props) {
  const { status } = homeContent;
  // Date joined the current company: earliest start across its positions,
  // so a promotion doesn't reset it
  const currentOrg = career.find((org) => org.positions.some((p) => !p.end));
  const since = currentOrg?.positions
    .map((p) => p.start)
    .sort((a, b) => Date.parse(`1 ${a}`) - Date.parse(`1 ${b}`))[0];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="size-2 rounded-full bg-ok" aria-hidden="true" />
          Currently
        </p>
        <p className="mt-3 text-lg font-semibold leading-snug">{status.role}</p>
        <p className="text-sm text-muted-foreground">
          at{" "}
          <Link
            href={status.href}
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            {status.company}
          </Link>
          {since && <> · since {since}</>}
        </p>
      </Card>

      <Card className="flex-1">
        <dl className="grid h-full grid-cols-2 content-center gap-x-4 gap-y-6">
          {stats.map((s) => (
            <div key={s.title} className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">{s.title}</dt>
              <dd className="text-2xl font-semibold tabular-nums tracking-tight">
                {s.value}
              </dd>
              <dd className="text-xs text-muted-foreground">{s.note}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
