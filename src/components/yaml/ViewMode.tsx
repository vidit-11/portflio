"use client";

import { cn } from "@/lib/utils";
import { Braces } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import YamlView from "./YamlView";

type Mode = "page" | "yaml";

interface ViewModeState {
  mode: Mode;
  toggle: () => void;
  // true while the current page has a YAML version to show
  available: boolean;
  setAvailable: (v: boolean) => void;
}

const ViewModeContext = createContext<ViewModeState | null>(null);
const STORAGE_KEY = "view-mode";

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("page");
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "yaml") setMode("yaml");
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setMode((m) => {
      const next = m === "page" ? "yaml" : "page";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      return next;
    });
  }, []);

  return (
    <ViewModeContext.Provider value={{ mode, toggle, available, setAvailable }}>
      {children}
    </ViewModeContext.Provider>
  );
}

function useViewMode() {
  const ctx = useContext(ViewModeContext);
  if (!ctx) throw new Error("useViewMode must be used inside ViewModeProvider");
  return ctx;
}

export function YamlToggle() {
  const { mode, toggle, available } = useViewMode();
  if (!available) return null;

  const on = mode === "yaml";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      title={on ? "Back to the normal page" : "View this page as YAML"}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md px-2 font-mono text-xs transition-colors sm:px-2.5",
        on
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <Braces className="size-3.5" aria-hidden="true" />
      <span className="sr-only min-[400px]:not-sr-only">yaml</span>
    </button>
  );
}

interface SwitchProps {
  yaml: string;
  command: string;
  filename: string;
  children: React.ReactNode;
}

// Shows the page normally, or its YAML representation when the header toggle is on
export function YamlSwitch({ yaml, command, filename, children }: SwitchProps) {
  const { mode, setAvailable } = useViewMode();

  useEffect(() => {
    setAvailable(true);
    return () => setAvailable(false);
  }, [setAvailable]);

  return mode === "yaml" ? (
    <YamlView yaml={yaml} command={command} filename={filename} />
  ) : (
    <>{children}</>
  );
}
