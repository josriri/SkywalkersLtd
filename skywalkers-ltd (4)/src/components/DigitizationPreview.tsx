import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Card, Eyebrow } from "./ui";

const ledgerRows = ["Mama Njeri Duka — 450", "Boda parts — 1,200", "Rent — 3,000", "Airtime resale — 200"];
const barHeights = [40, 65, 30, 80, 55, 90, 70];

export function DigitizationPreview() {
  const [pos, setPos] = useState(50);

  return (
    <Card className="overflow-hidden !p-0">
      <div className="px-6 pt-6">
        <Eyebrow tone="teal">Signature tool</Eyebrow>
        <h3 className="font-display text-2xl mb-1 text-ink dark:text-[#EDE9DD]">The Digitization Preview</h3>
        <p className="text-sm mb-5 text-[#6B6153] dark:text-[#9AA3B5]">
          Drag the slider. Left is the ledger book. Right is the dashboard it becomes.
        </p>
      </div>

      <div className="relative h-72 select-none bg-[#EFE6D2]">
        {/* Ledger side, full background */}
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <p className="font-display text-lg mb-3 text-[#5B4A32]">Daily Ledger</p>
          {ledgerRows.map((r) => (
            <p key={r} className="text-sm border-b py-1.5 font-mono text-[#6B5A3F] border-[#D8C9A8]">
              {r}
            </p>
          ))}
        </div>

        {/* Dashboard side, clipped by slider position */}
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
          <div className="absolute inset-0 flex flex-col justify-center px-8 bg-ink">
            <p className="font-display text-lg mb-3 text-white">Revenue Dashboard</p>
            <div className="flex gap-3 mb-3">
              <div className="flex-1 rounded-lg p-3 bg-ink-soft">
                <p className="text-[10px] uppercase tracking-wide text-white/60">Today</p>
                <p className="text-white font-display text-lg">KES 4,850</p>
              </div>
              <div className="flex-1 rounded-lg p-3 bg-ink-soft">
                <p className="text-[10px] uppercase tracking-wide text-white/60">This week</p>
                <p className="text-white font-display text-lg">KES 31,200</p>
              </div>
            </div>
            <div className="w-full h-16 rounded-lg flex items-end gap-1 px-2 pb-1 bg-ink-soft">
              {barHeights.map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-teal" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Handle */}
        <div className="absolute top-0 bottom-0 w-1 bg-clay" style={{ left: `${pos}%` }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-lg bg-clay">
            <ArrowLeftRight size={16} className="text-white" />
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Reveal the digitized dashboard"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        />
      </div>
    </Card>
  );
}
