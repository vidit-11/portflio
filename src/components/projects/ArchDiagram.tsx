"use client";

import { Diagram } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

type Architecture = Diagram;
type Node = Architecture["nodes"][number];
type Size = { w: number; h: number };

const W = 500;
const H = 300;
const GAP = 3; // space between a connector and the box it leaves
const ARROW_GAP = 9; // room for the arrowhead, which extends past the line end

// useLayoutEffect warns during SSR; fall back to useEffect there
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

// Rough label size used until the real boxes have been measured
const estimate = (n: Node): Size => ({ w: n.label.length * 8 + 22, h: 26 });

// Right-angled connector between two boxes.
// "hv" leaves sideways, turns at the midpoint and enters sideways; "vh" does the same vertically.
function route(a: Node, b: Node, sa: Size, sb: Size, mode?: "hv" | "vh") {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const m = mode ?? (Math.abs(dx) >= Math.abs(dy) ? "hv" : "vh");

  if (m === "hv") {
    const dir = Math.sign(dx) || 1;
    const sx = a.x + dir * (sa.w / 2 + GAP);
    const ex = b.x - dir * (sb.w / 2 + ARROW_GAP);
    if (Math.abs(dy) < 1) return `M${sx},${a.y} H${ex}`;
    const mx = (sx + ex) / 2;
    return `M${sx},${a.y} H${mx} V${b.y} H${ex}`;
  }
  const dir = Math.sign(dy) || 1;
  const sy = a.y + dir * (sa.h / 2 + GAP);
  const ey = b.y - dir * (sb.h / 2 + ARROW_GAP);
  if (Math.abs(dx) < 1) return `M${a.x},${sy} V${ey}`;
  const my = (sy + ey) / 2;
  return `M${a.x},${sy} V${my} H${b.x} V${ey}`;
}

export default function ArchDiagram({
  architecture,
  name,
}: {
  architecture: Architecture;
  name: string;
}) {
  const { nodes, edges, groups = [] } = architecture;
  const [active, setActive] = useState<string | null>(null);
  const [sizes, setSizes] = useState<Record<string, Size>>({});
  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const uid = useId().replace(/:/g, "");
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const current = active ? byId.get(active) : undefined;

  // Measure each label box in canvas units so connectors meet the boxes exactly
  useIsoLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const measure = () => {
      const scale = W / canvas.getBoundingClientRect().width;
      const next: Record<string, Size> = {};
      nodeRefs.current.forEach((el, id) => {
        const r = el.getBoundingClientRect();
        next[id] = { w: r.width * scale, h: r.height * scale };
      });
      setSizes(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  const sizeOf = (n: Node) => sizes[n.id] ?? estimate(n);

  return (
    <div className="border-b">
      <div
        ref={canvasRef}
        className="relative aspect-[5/3] w-full bg-muted/40 [background-image:radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px]"
        onMouseLeave={() => setActive(null)}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 size-full"
          aria-hidden="true"
        >
          <defs>
            {(["idle", "hot"] as const).map((kind) => (
              <marker
                key={kind}
                id={`${uid}-${kind}`}
                viewBox="0 0 10 10"
                refX="1"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path
                  d="M0,0 L10,5 L0,10 z"
                  className={
                    kind === "hot" ? "fill-brand" : "fill-muted-foreground/60"
                  }
                />
              </marker>
            ))}
          </defs>

          {groups.map((g) => (
            <rect
              key={g.label}
              x={g.x}
              y={g.y}
              width={g.w}
              height={g.h}
              rx={10}
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
              className="fill-background/40 stroke-border"
            />
          ))}

          {edges.map(([from, to, mode]) => {
            const a = byId.get(from);
            const b = byId.get(to);
            if (!a || !b) return null;
            const hot = !!active && (from === active || to === active);
            return (
              <path
                key={`${from}-${to}`}
                d={route(a, b, sizeOf(a), sizeOf(b), mode)}
                fill="none"
                markerEnd={`url(#${uid}-${hot ? "hot" : "idle"})`}
                strokeWidth={hot ? 2 : 1.5}
                strokeDasharray="5 4"
                strokeLinejoin="round"
                className={cn(
                  "animate-flow transition-colors motion-reduce:animate-none",
                  hot
                    ? "stroke-brand"
                    : active
                      ? "stroke-border"
                      : "stroke-muted-foreground/50",
                )}
              />
            );
          })}
        </svg>

        {groups.map((g) => (
          <span
            key={g.label}
            className="absolute -translate-y-1/2 bg-card px-1.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground sm:text-[10px]"
            style={{
              left: `calc(${(g.x / W) * 100}% + 10px)`,
              top: `${(g.y / H) * 100}%`,
            }}
          >
            {g.label}
          </span>
        ))}

        {nodes.map((node) => {
          const on = active === node.id;
          return (
            <button
              key={node.id}
              ref={(el) => {
                if (el) nodeRefs.current.set(node.id, el);
                else nodeRefs.current.delete(node.id);
              }}
              type="button"
              onMouseEnter={() => setActive(node.id)}
              onFocus={() => setActive(node.id)}
              onClick={() => setActive(on ? null : node.id)}
              aria-pressed={on}
              aria-describedby={on ? `${uid}-note` : undefined}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border bg-card px-2 py-1 font-mono text-[10px] shadow-sm transition-colors focus-visible:outline-none sm:px-2.5 sm:text-xs",
                on
                  ? "border-brand text-foreground ring-2 ring-brand/30"
                  : "text-muted-foreground hover:text-foreground",
              )}
              style={{
                left: `${(node.x / W) * 100}%`,
                top: `${(node.y / H) * 100}%`,
              }}
            >
              {node.label}
            </button>
          );
        })}
      </div>

      <p
        id={`${uid}-note`}
        aria-live="polite"
        className="min-h-[4.5rem] px-6 py-3 text-sm text-muted-foreground"
      >
        {current ? (
          <>
            <span className="font-medium text-foreground">{current.label}</span>{" "}
            : {current.note}
          </>
        ) : (
          <>Hover or tap a box for details.</>
        )}
      </p>
    </div>
  );
}
