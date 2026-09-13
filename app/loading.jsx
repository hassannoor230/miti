export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4" role="status" aria-label="Loading">
      <div className="font-display text-3xl tracking-wide text-espresso">
        Miti <span className="italic text-rosewood">Beauty</span>
      </div>
      <div className="h-px w-40 overflow-hidden bg-sand">
        <div className="h-full w-1/2 animate-marquee bg-gradient-to-r from-gold to-rosewood" />
      </div>
      <p className="text-sm tracking-lux uppercase text-espresso-soft">Preparing something beautiful</p>
    </div>
  );
}
