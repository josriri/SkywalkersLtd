import { Check } from "lucide-react";
import { Card, Pill, Eyebrow } from "../components/ui";
import { bizServices } from "../data/services";
import { DigitizationPreview } from "../components/DigitizationPreview";
import { ROICalculator } from "../components/ROICalculator";
import { ContactBlock } from "../components/ContactBlock";

const process = [
  { t: "Audit", d: "We map what's on paper and what's slowing you down." },
  { t: "Build", d: "Site, app, database, and registrations built in parallel." },
  { t: "Launch", d: "You go live with training for you and your staff." },
  { t: "Run", d: "Ongoing management — socials, payroll, support." },
];

const benefits = [
  "More customers found online",
  "Zero lost paperwork",
  "Payroll and taxes filed on time",
  "One dashboard, not five notebooks",
];

export function DigitizeBiz() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-10">
        <Pill tone="teal">Division A · Business Assets</Pill>
        <h1 className="font-display mt-5 text-4xl sm:text-5xl leading-tight text-ink dark:text-[#EDE9DD]">
          DigitizeBiz
        </h1>
        <p className="mt-4 max-w-xl text-base text-[#5B5142] dark:text-[#B9C0CE]">
          We take your business off paper and put it on systems that grow it — design,
          registration, and the back office, all in one place.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-16">
        {bizServices.map((s) => (
          <Card key={s.title}>
            <s.icon size={20} className="mb-3 text-teal" />
            <p className="font-display text-lg mb-1 text-ink dark:text-[#EDE9DD]">{s.title}</p>
            <p className="text-sm text-[#6B6153] dark:text-[#9AA3B5]">{s.desc}</p>
          </Card>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-6 pb-16">
        <DigitizationPreview />
        <ROICalculator />
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-16">
        <Eyebrow tone="teal">Process</Eyebrow>
        <h2 className="font-display text-3xl mb-6 text-ink dark:text-[#EDE9DD]">How it runs</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          {process.map((p, i) => (
            <Card key={p.t}>
              <p className="font-display text-3xl mb-2 text-teal">0{i + 1}</p>
              <p className="font-semibold mb-1 text-ink dark:text-[#EDE9DD]">{p.t}</p>
              <p className="text-sm text-[#6B6153] dark:text-[#9AA3B5]">{p.d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-16">
        <Card>
          <Eyebrow tone="clay">Benefits</Eyebrow>
          <div className="grid sm:grid-cols-2 gap-3 mt-2">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-2">
                <Check size={16} className="text-teal" />
                <span className="text-sm text-ink dark:text-[#EDE9DD]">{b}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <ContactBlock
        tone="teal"
        division="digitizebiz"
        heading="Ready to take your business digital?"
        sub="Tell us where the paperwork is slowing you down."
      />
    </div>
  );
}
