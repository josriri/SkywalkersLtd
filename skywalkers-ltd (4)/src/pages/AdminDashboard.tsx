import { useCallback, useEffect, useState } from "react";
import { LogOut, RefreshCcw, Trash2 } from "lucide-react";
import { Btn, Card, cn } from "../components/ui";
import { api, ApiError, type Consultation, type ConsultationStatus, type Division } from "../lib/api";
import { useAuth } from "../lib/auth";

const STATUS_LABEL: Record<ConsultationStatus, string> = {
  new: "New",
  contacted: "Contacted",
  in_progress: "In progress",
  closed: "Closed",
};

const STATUS_TONE: Record<ConsultationStatus, string> = {
  new: "bg-clay-soft text-clay dark:bg-clay/20",
  contacted: "bg-teal-soft text-teal dark:bg-teal/20",
  in_progress: "bg-ink/10 text-ink dark:bg-white/10 dark:text-[#EDE9DD]",
  closed: "bg-line/60 text-[#6B6153] dark:bg-line-dark dark:text-[#9AA3B5]",
};

const DIVISION_LABEL: Record<Division, string> = {
  digitizebiz: "DigitizeBiz",
  citizenease: "CitizenEase",
};

export function AdminDashboard() {
  const { token, logout } = useAuth();
  const [items, setItems] = useState<Consultation[]>([]);
  const [counts, setCounts] = useState<Record<ConsultationStatus, number> | null>(null);
  const [divisionFilter, setDivisionFilter] = useState<Division | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.listConsultations(token, {
        division: divisionFilter === "all" ? undefined : divisionFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setItems(res.items);
      setCounts(res.counts);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      setError(err instanceof ApiError ? err.message : "Could not load consultations.");
    } finally {
      setLoading(false);
    }
  }, [token, divisionFilter, statusFilter, logout]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(id: string, status: ConsultationStatus) {
    if (!token) return;
    // Optimistic update, rolled back on failure.
    const prev = items;
    setItems((cur) => cur.map((c) => (c.id === id ? { ...c, status } : c)));
    try {
      await api.updateStatus(token, id, status);
    } catch (err) {
      setItems(prev);
      setError(err instanceof ApiError ? err.message : "Could not update status.");
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;
    if (!confirm("Delete this consultation? This cannot be undone.")) return;
    const prev = items;
    setItems((cur) => cur.filter((c) => c.id !== id));
    try {
      await api.deleteConsultation(token, id);
    } catch (err) {
      setItems(prev);
      setError(err instanceof ApiError ? err.message : "Could not delete.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-24">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink dark:text-[#EDE9DD]">Consultations</h1>
          <p className="text-sm text-[#6B6153] dark:text-[#9AA3B5]">
            Requests submitted from the DigitizeBiz and CitizenEase contact forms.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="outline" onClick={load}>
            <RefreshCcw size={15} /> Refresh
          </Btn>
          <Btn variant="ghost" onClick={logout}>
            <LogOut size={15} /> Log out
          </Btn>
        </div>
      </div>

      {counts && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {(Object.keys(STATUS_LABEL) as ConsultationStatus[]).map((s) => (
            <Card key={s} className="!p-4">
              <p className="text-xs uppercase tracking-wide font-semibold mb-1 text-[#6B6153] dark:text-[#9AA3B5]">
                {STATUS_LABEL[s]}
              </p>
              <p className="font-display text-2xl text-ink dark:text-[#EDE9DD]">{counts[s]}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={divisionFilter}
          onChange={(e) => setDivisionFilter(e.target.value as Division | "all")}
          className="rounded-lg border border-line dark:border-line-dark bg-transparent px-3 py-2 text-sm text-ink dark:text-[#EDE9DD]"
        >
          <option value="all">All divisions</option>
          <option value="digitizebiz">DigitizeBiz</option>
          <option value="citizenease">CitizenEase</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ConsultationStatus | "all")}
          className="rounded-lg border border-line dark:border-line-dark bg-transparent px-3 py-2 text-sm text-ink dark:text-[#EDE9DD]"
        >
          <option value="all">All statuses</option>
          {(Object.keys(STATUS_LABEL) as ConsultationStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-clay mb-4">{error}</p>}

      <Card className="!p-0 overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-[#6B6153] dark:text-[#9AA3B5]">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-[#6B6153] dark:text-[#9AA3B5]">No consultations match these filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line dark:border-line-dark text-left">
                  <th className="p-4 font-semibold text-ink dark:text-[#EDE9DD]">Name</th>
                  <th className="p-4 font-semibold text-ink dark:text-[#EDE9DD]">Contact</th>
                  <th className="p-4 font-semibold text-ink dark:text-[#EDE9DD]">Division</th>
                  <th className="p-4 font-semibold text-ink dark:text-[#EDE9DD]">Message</th>
                  <th className="p-4 font-semibold text-ink dark:text-[#EDE9DD]">Received</th>
                  <th className="p-4 font-semibold text-ink dark:text-[#EDE9DD]">Status</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-b border-line dark:border-line-dark last:border-0 align-top">
                    <td className="p-4 text-ink dark:text-[#EDE9DD] whitespace-nowrap">{c.name}</td>
                    <td className="p-4 text-[#6B6153] dark:text-[#9AA3B5] whitespace-nowrap">{c.contact}</td>
                    <td className="p-4 text-[#6B6153] dark:text-[#9AA3B5] whitespace-nowrap">
                      {DIVISION_LABEL[c.division]}
                    </td>
                    <td className="p-4 text-[#6B6153] dark:text-[#9AA3B5] max-w-xs">
                      {c.message || <span className="italic">—</span>}
                    </td>
                    <td className="p-4 text-[#6B6153] dark:text-[#9AA3B5] whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value as ConsultationStatus)}
                        className={cn("rounded-full text-xs font-semibold px-3 py-1.5 border-0", STATUS_TONE[c.status])}
                      >
                        {(Object.keys(STATUS_LABEL) as ConsultationStatus[]).map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(c.id)}
                        aria-label={`Delete consultation from ${c.name}`}
                        className="text-[#6B6153] dark:text-[#9AA3B5] hover:text-clay"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
