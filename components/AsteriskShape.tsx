import { cn } from "@/lib/cn";

interface AsteriskShapeProps {
  className?: string;
  colorClassName?: string;
}

export function AsteriskShape({ className, colorClassName = "fill-lime" }: AsteriskShapeProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <g transform="translate(50,50)" className={colorClassName}>
        {[0, 60, 120].map((deg) => (
          <rect key={deg} x="-6" y="-45" width="12" height="90" rx="6" transform={`rotate(${deg})`} />
        ))}
      </g>
    </svg>
  );
}

export default AsteriskShape;

export function Spinner({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-3.5 shrink-0 animate-spinner rounded-full border-2",
        tone === "light" ? "border-white/35 border-t-white" : "border-forest-dark/20 border-t-forest-dark",
      )}
    />
  );
}
