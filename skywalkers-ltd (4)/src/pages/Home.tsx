import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Contact, Sparkles } from "lucide-react";
import { Card, Pill } from "../components/ui";

export function Home() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16 text-center">
        <Pill>
          <Sparkles size={12} /> A corporation for every asset you own
        </Pill>
        <h1 className="font-display mt-6 text-4xl sm:text-6xl leading-[1.05] text-ink dark:text-[#EDE9DD]">
          We digitize and manage <span className="text-teal">businesses</span> and{" "}
          <span className="text-clay">individuals</span>, under one roof.
        </h1>
        <p className="mt-6 text-base sm:text-lg max-w-2xl mx-auto text-[#5B5142] dark:text-[#B9C0CE]">
          Skywalkers Ltd runs two divisions: DigitizeBiz takes your company from paper to a fully
          digital operation. CitizenEase handles every government service you personally need —
          eCitizen and county — so you never queue for a document again.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 grid sm:grid-cols-2 gap-6 pb-20">
        <Link to="/digitizebiz" className="text-left group block">
          <Card className="h-full transition-transform group-hover:-translate-y-1 border-[1.5px] border-teal">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-teal-soft dark:bg-teal/20">
              <Briefcase size={20} className="text-teal" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1 text-teal">
              Division A · Business Assets
            </p>
            <h3 className="font-display text-2xl mb-2 text-ink dark:text-[#EDE9DD]">DigitizeBiz</h3>
            <p className="text-sm mb-5 text-[#6B6153] dark:text-[#9AA3B5]">
              Web & app design, socials, databases, company, business, sacco registration and
              payroll — everything to run your company digitally.
            </p>
            <span className="text-sm font-semibold inline-flex items-center gap-1.5 text-teal">
              Explore DigitizeBiz <ArrowRight size={15} />
            </span>
          </Card>
        </Link>

        <Link to="/citizenease" className="text-left group block">
          <Card className="h-full transition-transform group-hover:-translate-y-1 border-[1.5px] border-clay">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-clay-soft dark:bg-clay/20">
              <Contact size={20} className="text-clay" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1 text-clay">
              Division B · Individual Assets
            </p>
            <h3 className="font-display text-2xl mb-2 text-ink dark:text-[#EDE9DD]">CitizenEase</h3>
            <p className="text-sm mb-5 text-[#6B6153] dark:text-[#9AA3B5]">
              Your ID, passport, land, licences, tax and county paperwork — every eCitizen and
              county service, handled for you, end to end.
            </p>
            <span className="text-sm font-semibold inline-flex items-center gap-1.5 text-clay">
              Explore CitizenEase <ArrowRight size={15} />
            </span>
          </Card>
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-24">
        <Card className="text-center py-10 bg-ink dark:bg-card-dark">
          <p className="font-display text-xl sm:text-2xl max-w-2xl mx-auto text-white">
            "One relationship. Every asset — the company you built and the paperwork of your own
            life — digitized, filed, and looked after."
          </p>
        </Card>
      </section>
    </div>
  );
}
