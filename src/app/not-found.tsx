"use client";

import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname() ?? "/";

  return (
    <article className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="title">Page not found</h1>
      <p className="max-w-sm break-all text-muted-foreground">
        Nothing is deployed at{" "}
        <code className="font-mono text-sm text-foreground">{pathname}</code>.
      </p>
      <Button asChild variant="outline" className="mt-4">
        <Link href="/">
          <ArrowLeft /> Back home
        </Link>
      </Button>
    </article>
  );
}
