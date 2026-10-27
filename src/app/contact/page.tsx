import ContactForm from "@/components/ContactForm";
import { Card } from "@/components/home/Section";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import socialData from "@/data/socials.json";
import { socialSchema } from "@/lib/schemas";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  const socials = socialSchema.parse(socialData).socials;

  return (
    <article className="flex flex-col gap-10 py-10 sm:py-14">
      <PageHeader
        title="Get in touch"
        description="I'm open to DevOps and SRE roles. Use the form or email me directly."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <ContactForm />
        </Card>

        <Card className="self-start p-0">
          <ul className="divide-y">
            {socials.map((s) => (
              <li key={s.name}>
                <Link
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/50"
                >
                  <Icon
                    name={s.icon}
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-sm font-medium">{s.name}</span>
                  <ArrowUpRight
                    className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </article>
  );
}
