import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "./ui";

const items = [
  { to: "/", label: "Skywalkers Ltd" },
  { to: "/digitizebiz", label: "DigitizeBiz" },
  { to: "/citizenease", label: "CitizenEase" },
];

export function Nav() {
  const { pathname } = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="sticky top-0 z-30 border-b border-line dark:border-line-dark bg-paper/85 dark:bg-paper-dark/85 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-semibold text-lg text-ink dark:text-[#EDE9DD]"
        >
          <span className="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm font-display bg-ink">
            S
          </span>
          Skywalkers Ltd
        </Link>

        <div className="hidden sm:flex items-center gap-1 rounded-full p-1 border border-line dark:border-line-dark">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "text-sm font-medium px-4 py-1.5 rounded-full transition-colors",
                pathname === it.to ? "bg-ink text-white" : "text-[#5B5142] dark:text-[#B9C0CE]"
              )}
            >
              {it.label}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="w-9 h-9 rounded-full flex items-center justify-center border border-line dark:border-line-dark text-ink dark:text-[#EDE9DD]"
          aria-label="Toggle color theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <div className="sm:hidden flex justify-center gap-1 pb-2 px-4">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className={cn(
              "text-xs font-medium px-3 py-1.5 rounded-full flex-1 text-center",
              pathname === it.to ? "bg-ink text-white" : "text-[#5B5142] dark:text-[#B9C0CE]"
            )}
          >
            {it.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
