"use client";

import { Button } from "@/components/ui/Button";
import { Check, Copy, Download } from "lucide-react";
import { Fragment, useState } from "react";

interface Props {
  yaml: string;
  command: string;
  filename: string;
}

// Minimal line-based highlighter: keys, quoted strings, numbers/booleans, list dashes
function highlight(line: string) {
  const m = line.match(/^(\s*)(- )?(?:([\w./-]+):(?=\s|$))?(.*)$/);
  if (!m) return line;
  const [, indent, dash, key, rest] = m;
  return (
    <>
      {indent}
      {dash && <span className="text-muted-foreground">- </span>}
      {key && (
        <>
          <span className="text-sky-700 dark:text-sky-400">{key}</span>
          <span className="text-muted-foreground">:</span>
        </>
      )}
      {value(rest)}
    </>
  );
}

function value(raw: string) {
  const v = raw.trim();
  if (!v) return raw;
  const lead = raw.slice(0, raw.length - raw.trimStart().length);
  let cls = "text-foreground";
  if (/^["'].*["']$/.test(v)) cls = "text-emerald-700 dark:text-emerald-400";
  else if (/^(-?\d+(\.\d+)?|true|false|null)$/.test(v))
    cls = "text-orange-600 dark:text-orange-400";
  return (
    <>
      {lead}
      <span className={cls}>{v}</span>
    </>
  );
}

export default function YamlView({ yaml, command, filename }: Props) {
  const [copied, setCopied] = useState(false);
  const lines = yaml.trimEnd().split("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([yaml], { type: "text/yaml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <article className="py-10 sm:py-14">
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <p className="min-w-0 truncate font-mono text-sm">
            <span className="text-muted-foreground">$ </span>
            {command}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copy}>
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" onClick={download}>
              <Download /> {filename}
            </Button>
          </div>
        </div>
        <pre className="overflow-x-auto py-4 font-mono text-[13px] leading-6">
          <code className="grid grid-cols-[auto_1fr]">
            {lines.map((line, i) => (
              <Fragment key={i}>
                <span
                  className="select-none pl-4 pr-4 text-right text-muted-foreground/50"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="whitespace-pre-wrap break-words pr-4">
                  {highlight(line)}
                </span>
              </Fragment>
            ))}
          </code>
        </pre>
      </div>
    </article>
  );
}
