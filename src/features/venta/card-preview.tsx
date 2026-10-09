import { AsteriskShape } from "@/components/ui/asterisk-shape";

interface CardPreviewProps {
  number: string;
  holder: string;
  expiry: string;
}

const groupDigits = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  if (!digits) return "•••• •••• •••• ••••";
  return digits.padEnd(16, "•").match(/.{1,4}/g)!.join(" ");
};

export function CardPreview({ number, holder, expiry }: CardPreviewProps) {
  return (
    <div
      aria-label="Vista previa de la tarjeta"
      role="img"
      className="relative mx-auto flex aspect-[1.586] w-full max-w-[360px] flex-col justify-between overflow-hidden rounded-[18px] bg-linear-135 from-forest-dark to-forest-light px-6 py-[1.4rem] text-white shadow-lg"
    >
      <div className="relative z-10 flex items-start justify-between">
        <div className="relative h-7 w-[38px] overflow-hidden rounded-sm bg-linear-135 from-chip-gold to-chip-gold-dark">
          <span className="absolute inset-x-0 top-[9px] h-px bg-chip-line" />
          <span className="absolute inset-x-0 top-[18px] h-px bg-chip-line" />
          <span className="absolute inset-y-0 left-[13px] w-px bg-chip-line" />
          <span className="absolute inset-y-0 left-[25px] w-px bg-chip-line" />
        </div>
        <span className="text-xs font-bold tracking-[.04em] opacity-80">Spark Pay</span>
      </div>
      <div className="relative z-10 text-[1.15rem] font-semibold tracking-[.12em] whitespace-nowrap tabular-nums">
        {groupDigits(number)}
      </div>
      <div className="relative z-10 flex gap-6">
        <div className="min-w-0 flex-1">
          <div className="text-[.6rem] font-bold tracking-[.08em] opacity-60">TITULAR</div>
          <div className="truncate text-[.8rem] font-semibold tracking-[.04em]">
            {holder.trim() ? holder.toUpperCase() : "NOMBRE DEL TITULAR"}
          </div>
        </div>
        <div className="pr-10">
          <div className="text-[.6rem] font-bold tracking-[.08em] opacity-60">VENCE</div>
          <div className="text-[.8rem] font-semibold tabular-nums">{expiry || "MM/AA"}</div>
        </div>
      </div>
      <AsteriskShape className="absolute -right-3.5 -bottom-3.5 size-[84px] opacity-90" />
    </div>
  );
}

export default CardPreview;
