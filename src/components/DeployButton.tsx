"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export const PREFILL_KEY = "contact-prefill";

const STEPS = [
  ["checkout", "intent: hiring or collaboration"],
  ["build", "compiling a friendly hello"],
  ["test", "spam filter: passed · human: probably"],
  ["deploy", "scheduling a chat with Vidit"],
] as const;

export default function DeployButton({ label = "Get in touch" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const skipRef = useRef<HTMLButtonElement>(null);

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout);
    try {
      sessionStorage.setItem(PREFILL_KEY, "Hi Vidit, ");
    } catch {}
    router.push("/contact");
  }, [router]);

  const cancel = useCallback(() => {
    timers.current.forEach(clearTimeout);
    setOpen(false);
    setDone(0);
  }, []);

  const start = () => {
    const fast = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = fast ? 150 : 850;
    setDone(0);
    setOpen(true);
    timers.current = [
      ...STEPS.map((_, i) => setTimeout(() => setDone(i + 1), step * (i + 1))),
      setTimeout(finish, step * STEPS.length + (fast ? 200 : 700)),
    ];
  };

  useEffect(() => {
    if (!open) return;
    skipRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, cancel]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <>
      <Button onClick={start}>
        {label} <ArrowRight />
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
          onClick={cancel}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Deploying your message"
            className="w-full max-w-md overflow-hidden rounded-xl border bg-card shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1.5 border-b px-4 py-3">
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                deploy · contact-vidit
              </span>
            </div>
            <div
              className="flex flex-col gap-2 p-5 font-mono text-sm"
              aria-live="polite"
            >
              <p className="text-muted-foreground">
                $ deploy --target=vidit --env=inbox
              </p>
              {STEPS.map(([name, detail], i) => {
                const state =
                  i < done ? "done" : i === done ? "running" : "pending";
                return (
                  <p
                    key={name}
                    className={cn(
                      "flex items-start gap-2.5 transition-opacity",
                      state === "pending" && "opacity-30",
                    )}
                  >
                    {state === "done" ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-ok" />
                    ) : (
                      <Loader2
                        className={cn(
                          "mt-0.5 size-4 shrink-0 text-muted-foreground",
                          state === "running" && "animate-spin",
                        )}
                      />
                    )}
                    <span className="w-16 shrink-0">{name}</span>
                    <span className="text-muted-foreground">{detail}</span>
                  </p>
                );
              })}
              <p
                className={cn(
                  "mt-1 text-ok transition-opacity",
                  done < STEPS.length && "opacity-0",
                )}
              >
                → opening contact form…
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t px-4 py-3">
              <Button variant="ghost" size="sm" onClick={cancel}>
                Cancel
              </Button>
              <Button
                ref={skipRef}
                variant="outline"
                size="sm"
                onClick={finish}
              >
                Skip
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
