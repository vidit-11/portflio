import Link from "next/link";
import { ChaosButton } from "./chaos/Chaos";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import { YamlToggle } from "./yaml/ViewMode";

import homeContent from "@/data/home.json";
import routesData from "@/data/routes.json";

const navLinks = routesData.routes
  .filter((route) => route.showInNav && route.path !== "/")
  .map((route) => ({
    name: route.name,
    href: route.path,
    title: route.description,
  }));

export default function Header() {
  const [first, ...others] = homeContent.name.split(" ");
  const rest = others.length ? ` ${others.join(" ")}` : "";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-3 min-[360px]:px-4 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold"
          title="Home"
        >
          <span className="size-2 rounded-full bg-brand" aria-hidden="true" />
          {/* Surname shows from tablet width up so the nav fits on one line on phones */}
          <span>
            {first}
            <span className="hidden sm:inline">{rest}</span>
          </span>
        </Link>
        <div className="flex items-center min-[360px]:gap-1">
          <NavLinks links={navLinks} />
          <ChaosButton />
          <YamlToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
