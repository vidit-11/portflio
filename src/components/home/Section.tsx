import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border bg-card p-6", className)}>
      {children}
    </div>
  );
}

interface SectionProps {
  title: string;
  link?: { href: string; label: string };
  className?: string;
  children: React.ReactNode;
}

export function Section({ title, link, className, children }: SectionProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
        {link && (
          <Link
            href={link.href}
            className="link inline-flex items-center gap-1 text-sm"
          >
            {link.label} <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
