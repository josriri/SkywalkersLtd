import { ChevronRight, Globe2 } from "lucide-react";
import { Card, Pill, Eyebrow } from "../components/ui";
import { citizenCategories } from "../data/services";
import { DocumentChecklist } from "../components/DocumentChecklist";
import { ContactBlock } from "../components/ContactBlock";

const process = [
  { t: "Tell us the goal", d: "New passport, land transfer, county permit — just say it." },
  { t: "We give the checklist", d: "Exact documents, fees, and where each step happens." },
  { t: "We handle the queue", d: "Applications filed, forms submitted, offices followed up." },
  { t: "You get the outcome", d: "Certificate, licence, or permit delivered — done." },
];

export function CitizenEase() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-10">
        <Pill tone="clay">Division B · Individual Assets</Pill>
        <h1 className="font-display mt-5 text-4xl sm:text-5xl leading-tight text-ink dark:text-[#EDE9DD]">
          CitizenEase
        </h1>
        <p className="mt-4 max-w-xl text-base text-[#5B5142] dark:text-[#B9C0CE]">
          Every government service you'll ever personally need — on eCitizen and at your county
          office — handled for you, from the first form to the final stamp.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
        {citizenCategories.map((c) => (
          <Card key={c.title}>
            <c.icon size={20} className="mb-3 text-clay" />
            <p className="font-display text-lg mb-2 text-ink dark:text-[#EDE9DD]">{c.title}</p>
            <ul className="space-y-1">
              {c.items.map((it) => (
                <li key={it.name} className="text-sm flex items-start gap-1.5 text-[#6B6153] dark:text-[#9AA3B5]">
                  <ChevronRight size={13} className="mt-0.5 flex-shrink-0 text-clay" />
                  {it.name}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-6 pb-16 items-start">
        <DocumentChecklist />
        <Card>
          <Eyebrow tone="teal">Extension</Eyebrow>
          <div className="flex items-center gap-2 mb-2">
            <Globe2 size={18} className="text-teal" />
            <h3 className="font-display text-2xl text-ink dark:text-[#EDE9DD]">Diaspora Concierge</h3>
          </div>
          <p className="text-sm mb-4 text-[#6B6153] dark:text-[#9AA3B5]">
            Living abroad? We handle the in-person half of the process in Kenya — biometrics,
            document collection, physical submission — while you manage the online side from
            wherever you are.
          </p>
          <div className="rounded-lg p-4 bg-teal-soft dark:bg-teal/20">
            <p className="text-sm font-semibold text-teal">Popular with the diaspora:</p>
            <p className="text-sm mt-1 text-teal">
              Passport renewal · Police clearance · Land transactions · NSSF/NHIF status checks
            </p>
          </div>
        </Card>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-16">
        <Eyebrow tone="clay">Process</Eyebrow>
        <h2 className="font-display text-3xl mb-6 text-ink dark:text-[#EDE9DD]">How it runs</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          {process.map((p, i) => (
            <Card key={p.t}>
              <p className="font-display text-3xl mb-2 text-clay">0{i + 1}</p>
              <p className="font-semibold mb-1 text-ink dark:text-[#EDE9DD]">{p.t}</p>
              <p className="text-sm text-[#6B6153] dark:text-[#9AA3B5]">{p.d}</p>
            </Card>
          ))}
        </div>
      </section>

      <ContactBlock
        tone="clay"
        division="citizenease"
        heading="Have a government process to sort out?"
        sub="Tell us the service — we'll tell you what it takes."
      />
    </div>
  );
}
