"use client";

import { cn } from "@/lib/utils";
import { Loader2, Zap } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

type Phase = "down" | "restarting" | "healed";

interface Message {
  title: string;
  description: string;
}

// One realistic incident: what the alert says, what the card shows while it's
// broken and recovering, and the postmortem once it's resolved
interface Scenario {
  down: string;
  recovering: string;
  // pod is a pod name (with a random suffix); app is the Deployment name
  alert: (pod: string, app: string) => Message;
  resolved: (pod: string, secs: string, app: string) => Message;
}

const nodes = ["k3s-1", "k3s-2", "k3s-3"];
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const shortSha = () => Math.random().toString(16).slice(2, 9);

function makeScenarios(): Scenario[] {
  const failed = pick(nodes);
  const healthy = pick(nodes.filter((n) => n !== failed));
  const badTag = shortSha();
  const goodTag = shortSha();

  return [
    {
      // HA cluster loses a node; etcd keeps quorum and the pod moves
      down: "NodeNotReady",
      recovering: `Rescheduling → ${healthy}`,
      alert: (pod) => ({
        title: "FIRING: KubeNodeNotReady",
        description: `node/${failed} stopped reporting · etcd quorum 2/3 OK · pod/${pod} unreachable`,
      }),
      // The ReplicaSet creates a new pod (new name) rather than moving the old one
      resolved: (pod, secs, app) => ({
        title: `RESOLVED: pod/${app}-${podSuffix()} Running on ${healthy} (${secs}s)`,
        description: `Postmortem · Root cause: node/${failed} lost power (chaos test) · Impact: none, the control plane kept quorum and the ReplicaSet replaced pod/${pod} with a new pod on a healthy node · Follow-up: run 2+ replicas with a PodDisruptionBudget so there's no gap at all.`,
      }),
    },
    {
      // App hangs; the kubelet restarts the container and readiness holds traffic back
      down: "Liveness probe failed",
      recovering: "Restarting container",
      alert: (pod) => ({
        title: "FIRING: KubeContainerRestarting",
        description: `pod/${pod}: GET /actuator/health returned 503 three times in a row`,
      }),
      resolved: (pod, secs) => ({
        title: `RESOLVED: pod/${pod} Ready 1/1 (${secs}s)`,
        description: `Postmortem · Root cause: app thread pool deadlocked (chaos test) · Recovery: kubelet restarted the container; the readiness probe kept traffic away until it passed · Follow-up: capture a thread dump before restart to find the deadlock.`,
      }),
    },
    {
      // Bad release never becomes Ready; GitOps rollback via git revert
      down: `Rollout stuck: :${badTag}`,
      recovering: "git revert → Argo CD sync",
      alert: (_pod, app) => ({
        title: "FIRING: KubeDeploymentRolloutStuck",
        description: `deployment/${app}: new image :${badTag} failing readiness · old ReplicaSet still serving (maxUnavailable: 0)`,
      }),
      resolved: (_pod, secs, app) => ({
        title: `RESOLVED: deployment/${app} rolled back to :${goodTag} (${secs}s)`,
        description: `Postmortem · Root cause: release :${badTag} missing a required env var (chaos test) · Impact: no downtime, the rollout never removed healthy pods · Recovery: reverted the tag commit in the config repo and Argo CD synced · Follow-up: smoke-test the image before CI bumps the tag.`,
      }),
    },
  ];
}

interface ChaosState {
  target: string | null;
  phase: Phase | null;
  scenario: Scenario | null;
  register: (id: string, el: HTMLElement) => () => void;
  trigger: () => void;
}

const ChaosContext = createContext<ChaosState | null>(null);

const DOWN_MS = 2400;
const RESTART_MS = 1400;
const HEALED_MS = 1600;

const podSuffix = () => Math.random().toString(16).slice(2, 7);

export function ChaosProvider({ children }: { children: React.ReactNode }) {
  const targets = useRef(new Map<string, HTMLElement>());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [target, setTarget] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const lastIndex = useRef(-1);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const register = useCallback((id: string, el: HTMLElement) => {
    targets.current.set(id, el);
    return () => {
      targets.current.delete(id);
    };
  }, []);

  const trigger = useCallback(() => {
    if (phase) return;

    const all = Array.from(targets.current.entries());
    if (all.length === 0) {
      toast("Nothing on this page to break.");
      return;
    }
    // Prefer something the visitor can actually see
    const visible = all.filter(([, el]) => {
      const r = el.getBoundingClientRect();
      return r.bottom > 80 && r.top < window.innerHeight - 40;
    });
    const pool = visible.length ? visible : all;
    const [id, el] = pool[Math.floor(Math.random() * pool.length)];
    if (!visible.length)
      el.scrollIntoView({ behavior: "smooth", block: "center" });

    // A different incident each click
    const scenarios = makeScenarios();
    let index = Math.floor(Math.random() * scenarios.length);
    if (index === lastIndex.current) index = (index + 1) % scenarios.length;
    lastIndex.current = index;
    const sc = scenarios[index];

    const pod = `${el.dataset.pod}-${podSuffix()}`;
    const started = performance.now();
    setScenario(sc);
    setTarget(id);
    setPhase("down");
    const app = el.dataset.pod ?? "app";
    const alert = sc.alert(pod, app);
    toast.error(alert.title, { description: alert.description });

    timers.current = [
      setTimeout(() => setPhase("restarting"), DOWN_MS),
      setTimeout(() => {
        setPhase("healed");
        const secs = ((performance.now() - started) / 1000).toFixed(1);
        const done = sc.resolved(pod, secs, app);
        toast.success(done.title, {
          description: done.description,
          duration: 9000,
        });
      }, DOWN_MS + RESTART_MS),
      setTimeout(
        () => {
          setPhase(null);
          setTarget(null);
          setScenario(null);
        },
        DOWN_MS + RESTART_MS + HEALED_MS,
      ),
    ];
  }, [phase]);

  return (
    <ChaosContext.Provider
      value={{ target, phase, scenario, register, trigger }}
    >
      {children}
    </ChaosContext.Provider>
  );
}

function useChaos() {
  const ctx = useContext(ChaosContext);
  if (!ctx) throw new Error("useChaos must be used inside ChaosProvider");
  return ctx;
}

interface TargetProps {
  // Shown in the alert, e.g. "skills" → pod/skills-3fa9c
  pod: string;
  className?: string;
  children: React.ReactNode;
}

// Wraps a card so the chaos button can break it
export function ChaosTarget({ pod, className, children }: TargetProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const { target, phase, scenario, register } = useChaos();

  useEffect(() => {
    if (!ref.current) return;
    return register(id, ref.current);
  }, [id, register]);

  const state = target === id ? phase : null;

  return (
    <div
      ref={ref}
      data-pod={pod}
      className={cn(
        "relative rounded-xl transition-shadow duration-500",
        state === "down" &&
          "animate-shake ring-2 ring-destructive motion-reduce:animate-none",
        state === "restarting" && "ring-2 ring-border",
        state === "healed" && "ring-2 ring-ok",
        className,
      )}
    >
      {/* Only the content is greyed out, so the red ring and badge keep their colour */}
      <div
        className={cn(
          "flex h-full flex-col transition-[filter,opacity] duration-500 [&>*]:flex-1",
          state === "down" && "opacity-50 grayscale",
          state === "restarting" && "opacity-75 grayscale",
        )}
      >
        {children}
      </div>
      {(state === "down" || state === "restarting") && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/40"
          role="status"
        >
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-xs font-semibold shadow-sm",
              state === "down"
                ? "bg-destructive text-destructive-foreground"
                : "bg-card text-foreground ring-1 ring-border",
            )}
          >
            {state === "down" ? (
              scenario?.down
            ) : (
              <>
                <Loader2 className="size-3.5 animate-spin" />{" "}
                {scenario?.recovering}
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

export function ChaosButton() {
  const { trigger, phase } = useChaos();

  return (
    <button
      type="button"
      onClick={trigger}
      disabled={!!phase}
      className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 font-mono text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50 sm:px-2.5"
      title="Simulate a realistic incident on part of this page and watch it recover"
    >
      <Zap className="size-3.5" aria-hidden="true" />
      {/* Icon only on phones so the header fits on one line */}
      <span className="sr-only sm:not-sr-only">
        {phase ? "chaos in progress…" : "inject failure"}
      </span>
    </button>
  );
}
