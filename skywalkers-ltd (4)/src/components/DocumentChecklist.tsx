import { useState } from "react";
import { Card, Eyebrow, cn } from "./ui";
import { citizenCategories } from "../data/services";

export function DocumentChecklist() {
  const [catIdx, setCatIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const item = citizenCategories[catIdx].items[itemIdx];
  const keyFor = (i: number) => `${catIdx}-${itemIdx}-${i}`;
  const doneCount = item.docs.filter((_, i) => checked[keyFor(i)]).length;

  return (
    <Card>
      <Eyebrow tone="clay">Signature tool</Eyebrow>
      <h3 className="font-display text-2xl mb-1 text-ink dark:text-[#EDE9DD]">Document Checklist</h3>
      <p className="text-sm mb-5 text-[#6B6153] dark:text-[#9AA3B5]">
        Pick a service. We tell you exactly what to bring — nothing missed, no wasted trip.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {citizenCategories.map((c, i) => (
          <button
            key={c.title}
            onClick={() => {
              setCatIdx(i);
              setItemIdx(0);
            }}
            className={cn(
              "text-xs font-semibold px-3 py-1.5 rounded-full border",
              catIdx === i
                ? "border-clay bg-clay-soft text-clay dark:bg-clay/20"
                : "border-line dark:border-line-dark text-[#6B6153] dark:text-[#B9C0CE]"
            )}
          >
            {c.title}
          </button>
        ))}
      </div>

      <select
        value={itemIdx}
        onChange={(e) => setItemIdx(Number(e.target.value))}
        className="w-full mb-5 rounded-lg border border-line dark:border-line-dark bg-transparent px-3 py-2.5 text-sm text-ink dark:text-[#EDE9DD]"
      >
        {citizenCategories[catIdx].items.map((it, i) => (
          <option key={it.name} value={i}>
            {it.name}
          </option>
        ))}
      </select>

      <div className="space-y-2 mb-4">
        {item.docs.map((d, i) => (
          <label
            key={d}
            className="flex items-center gap-3 rounded-lg border border-line dark:border-line-dark px-3 py-2.5 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={!!checked[keyFor(i)]}
              onChange={() => setChecked((c) => ({ ...c, [keyFor(i)]: !c[keyFor(i)] }))}
              className="w-4 h-4 accent-clay"
            />
            <span
              className={cn(
                "text-sm text-ink dark:text-[#EDE9DD]",
                checked[keyFor(i)] && "line-through"
              )}
            >
              {d}
            </span>
          </label>
        ))}
      </div>

      <div className="rounded-lg p-3 text-center text-sm font-semibold bg-clay-soft text-clay dark:bg-clay/20">
        {doneCount} of {item.docs.length} ready
      </div>
    </Card>
  );
}
