"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  links: { name: string; href: string; title: string }[];
}

export default function NavLinks({ links }: Props) {
  const pathname = usePathname();

  return (
    <ul className="flex items-center">
      {links.map((nav) => {
        const active = pathname.startsWith(nav.href);
        return (
          <li key={nav.href}>
            <Link
              href={nav.href}
              title={nav.title}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-md px-1.5 py-1.5 text-sm transition-colors min-[360px]:px-2 sm:px-3",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {nav.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
