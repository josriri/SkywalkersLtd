import { Link } from "react-router-dom";
import { Mail, PhoneCall, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line dark:border-line-dark bg-[#EDE9DC] dark:bg-paper-dark mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid sm:grid-cols-4 gap-10">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2 font-display font-semibold text-lg mb-3 text-ink dark:text-[#EDE9DD]">
            <span className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-display bg-ink">
              S
            </span>
            Skywalkers Ltd
          </div>
          <p className="text-sm max-w-sm text-[#6B6153] dark:text-[#9AA3B5]">
            One corporation, every asset digitized — the business you run through DigitizeBiz, and the
            government life you manage through CitizenEase.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-3 text-ink dark:text-[#EDE9DD]">
            Divisions
          </p>
          <Link to="/digitizebiz" className="block text-sm mb-2 text-[#6B6153] dark:text-[#9AA3B5]">
            DigitizeBiz — Business assets
          </Link>
          <Link to="/citizenease" className="block text-sm text-[#6B6153] dark:text-[#9AA3B5]">
            CitizenEase — Individual assets
          </Link>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-3 text-ink dark:text-[#EDE9DD]">
            Contact
          </p>
          <p className="text-sm flex items-center gap-2 mb-2 text-[#6B6153] dark:text-[#9AA3B5]">
            <Mail size={14} /> mutwiriphillips@gmail.com
          </p>
          <p className="text-sm flex items-center gap-2 mb-2 text-[#6B6153] dark:text-[#9AA3B5]">
            <PhoneCall size={14} /> +254791994833
          </p>
          <p className="text-sm flex items-center gap-2 text-[#6B6153] dark:text-[#9AA3B5]">
            <MapPin size={14} /> Nairobi, Kenya
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 text-xs pb-8 text-[#9A9080] dark:text-[#5B667A]">
        <span>© {new Date().getFullYear()} Skywalkers Ltd. All rights reserved.</span>
        <span aria-hidden>·</span>
        <Link to="/admin" className="underline-offset-2 hover:underline">
          Admin
        </Link>
      </div>
    </footer>
  );
}
