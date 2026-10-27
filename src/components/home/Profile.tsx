import Socials from "@/components/Socials";
import { Button } from "@/components/ui/Button";
import { FileDown } from "lucide-react";
import Image from "next/image";
import { Card } from "./Section";

import homeContent from "@/data/home.json";

export default function Profile({ className }: { className?: string }) {
  const { name, role, location, avatar, headline, about } = homeContent;

  return (
    <Card className={className}>
      <div className="flex h-full flex-col gap-6">
        <div className="flex items-center gap-4">
          <Image
            src={avatar}
            alt={`Photo of ${name}`}
            width={64}
            height={64}
            priority
            className="size-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-lg font-semibold leading-tight">{name}</h1>
            <p className="text-sm text-muted-foreground">
              {role} · {location}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {headline}
          </p>
          {about.map((p, i) => (
            <p
              key={i}
              className="max-w-prose text-pretty text-muted-foreground"
            >
              {p}
            </p>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-5">
          <Button asChild>
            {/* plain <a>: next/link would prefetch the PDF as a page and 404 */}
            <a href="/resume.pdf" target="_blank">
              Resume <FileDown />
            </a>
          </Button>
          <Socials />
        </div>
      </div>
    </Card>
  );
}
