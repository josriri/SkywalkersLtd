import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Btn, Card } from "./ui";
import { api, ApiError, type Division } from "../lib/api";

export function ContactBlock({
  tone,
  heading,
  sub,
  division,
}: {
  tone: "teal" | "clay";
  heading: string;
  sub: string;
  division: Division;
}) {
  const borderClass = tone === "teal" ? "border-teal" : "border-clay";
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || contact.trim().length < 5) {
      setError("Add your name and a phone number or email.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      await api.submitConsultation({ name, contact, division, message });
      setStatus("done");
      setName("");
      setContact("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
      <Card className={`grid sm:grid-cols-2 gap-8 items-center border-[1.5px] ${borderClass}`}>
        <div>
          <h3 className="font-display text-2xl mb-2 text-ink dark:text-[#EDE9DD]">{heading}</h3>
          <p className="text-sm text-[#6B6153] dark:text-[#9AA3B5]">{sub}</p>
        </div>

        {status === "done" ? (
          <div className="rounded-lg p-5 flex items-center gap-3 bg-teal-soft dark:bg-teal/20">
            <Check size={18} className="text-teal flex-shrink-0" />
            <p className="text-sm text-teal">
              Thanks — we've received your request and will reach out shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              aria-label="Full name"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-line dark:border-line-dark bg-transparent px-4 py-2.5 text-sm text-ink dark:text-[#EDE9DD]"
            />
            <input
              aria-label="Phone or email"
              placeholder="Phone or email"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full rounded-lg border border-line dark:border-line-dark bg-transparent px-4 py-2.5 text-sm text-ink dark:text-[#EDE9DD]"
            />
            <textarea
              aria-label="What do you need help with?"
              placeholder="What do you need help with? (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-line dark:border-line-dark bg-transparent px-4 py-2.5 text-sm text-ink dark:text-[#EDE9DD] resize-none"
            />
            {status === "error" && <p className="text-sm text-clay">{error}</p>}
            <Btn tone={tone} type="submit" disabled={status === "submitting"} className="w-full">
              {status === "submitting" ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Request a consultation <ArrowRight size={15} />
                </>
              )}
            </Btn>
          </form>
        )}
      </Card>
    </section>
  );
}
