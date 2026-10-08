import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCountdownProps extends React.HTMLAttributes<HTMLDivElement> {
  target: Date;
}

type Parts = { days: number; hours: number; minutes: number; seconds: number };

const UNITS: { key: keyof Parts; label: string }[] = [
  { key: "days", label: "días" },
  { key: "hours", label: "horas" },
  { key: "minutes", label: "min" },
  { key: "seconds", label: "seg" },
];

function split(ms: number): Parts {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
  };
}

const pad = (value: number) => String(value).padStart(2, "0");

export function GlassCountdown({ target, className, ...props }: GlassCountdownProps) {
  const [remaining, setRemaining] = React.useState(() => target.getTime() - Date.now());

  React.useEffect(() => {
    const id = window.setInterval(() => setRemaining(target.getTime() - Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const parts = split(remaining);

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col justify-center rounded-3xl p-5 shadow-2xl",
        "bg-black/20 backdrop-blur-xl border border-white/10",
        "text-white",
        className,
      )}
      {...props}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-white/60">Faltan</p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {UNITS.map((unit) => (
          <div key={unit.key} className="rounded-xl border border-white/10 bg-white/10 px-1 py-2.5 text-center">
            <div className="text-2xl font-bold tabular-nums leading-none">{pad(parts[unit.key])}</div>
            <div className="mt-1.5 text-[10px] uppercase tracking-wider text-white/60">{unit.label}</div>
          </div>
        ))}
      </div>
      {remaining <= 0 && <p className="mt-3 text-sm font-semibold text-[#c0f381]">¡Hoy es el día de la fiesta!</p>}
    </div>
  );
}

GlassCountdown.displayName = "GlassCountdown";
