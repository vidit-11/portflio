import Icon from "@/components/Icon";
import ProjectDiagrams from "@/components/projects/ProjectDiagrams";
import { Project } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";

const statusLabel: Record<Project["status"], string> = {
  deployed: "Live",
  maintained: "Maintained",
  completed: "Completed",
  archived: "Archived",
};

interface Props {
  project: Project;
  showImage?: boolean;
}

export default function ProjectCard({ project, showImage }: Props) {
  const {
    name,
    description,
    image,
    status,
    tags,
    links,
    architecture,
    pipeline,
  } = project;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-foreground/20">
      {showImage && (architecture || pipeline) && (
        <ProjectDiagrams
          name={name}
          architecture={architecture}
          pipeline={pipeline}
        />
      )}
      {showImage && !architecture && !pipeline && image && (
        <Image
          src={image}
          alt={`${name} architecture`}
          width={500}
          height={300}
          sizes="(max-width: 640px) 100vw, 480px"
          className="aspect-[5/3] w-full border-b object-cover"
        />
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-snug">{name}</h3>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className={cn(
                "size-1.5 rounded-full",
                status === "deployed" || status === "maintained"
                  ? "bg-ok"
                  : "bg-muted-foreground/50",
              )}
            />
            {statusLabel[status]}
          </span>
        </div>
        <Markdown className="prose prose-sm max-w-none text-pretty text-muted-foreground dark:prose-invert prose-code:rounded prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-xs prose-code:font-normal prose-code:before:content-none prose-code:after:content-none [&_p]:m-0">
          {description}
        </Markdown>
        <p className="font-mono text-xs text-muted-foreground">
          {tags.join(" · ")}
        </p>
        {links.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-4 pt-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
              >
                <Icon name={link.icon} className="size-4" aria-hidden="true" />
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
