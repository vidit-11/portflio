import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card } from "./Section";

interface Item {
  title: string;
  subtitle: string;
  meta?: string;
  href?: string;
}

// Compact list card used for education and certifications
export default function SideList({ items }: { items: Item[] }) {
  return (
    <Card className="p-0">
      <ul className="divide-y">
        {items.map((item) => {
          const body = (
            <div className="flex items-start justify-between gap-3 px-6 py-4">
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.subtitle}
                  {item.meta && <> · {item.meta}</>}
                </p>
              </div>
              {item.href && (
                <ArrowUpRight
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                  aria-hidden="true"
                />
              )}
            </div>
          );
          return (
            <li key={item.title}>
              {item.href ? (
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group block transition-colors hover:bg-muted/50"
                >
                  {body}
                </Link>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
