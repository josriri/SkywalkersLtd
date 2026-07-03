import { useState } from "react";
import { Card, Eyebrow } from "./ui";

export function ROICalculator() {
  const [hoursSaved, setHoursSaved] = useState(10);
  const [hourlyValue, setHourlyValue] = useState(400);
  const monthly = hoursSaved * hourlyValue * 4;

  return (
    <Card>
      <Eyebrow tone="clay">Signature tool</Eyebrow>
      <h3 className="font-display text-2xl mb-1 text-ink dark:text-[#EDE9DD]">ROI Calculator</h3>
      <p className="text-sm mb-6 text-[#6B6153] dark:text-[#9AA3B5]">
        Estimate what going digital gives back to you every month.
      </p>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2 text-ink dark:text-[#EDE9DD]">
            <span>Hours saved per week</span>
            <span className="font-semibold">{hoursSaved}h</span>
          </div>
          <input
            type="range"
            min={1}
            max={40}
            value={hoursSaved}
            onChange={(e) => setHoursSaved(Number(e.target.value))}
            className="w-full accent-teal"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2 text-ink dark:text-[#EDE9DD]">
            <span>Value of your time (KES/hr)</span>
            <span className="font-semibold">{hourlyValue}</span>
          </div>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={hourlyValue}
            onChange={(e) => setHourlyValue(Number(e.target.value))}
            className="w-full accent-teal"
          />
        </div>

        <div className="rounded-xl p-5 text-center bg-teal-soft dark:bg-teal/20">
          <p className="text-xs uppercase tracking-wide font-semibold text-teal">
            Estimated monthly value recovered
          </p>
          <p className="font-display text-3xl mt-1 text-teal">KES {monthly.toLocaleString()}</p>
        </div>
      </div>
    </Card>
  );
}
