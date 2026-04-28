import { ChevronDown } from "lucide-react";
import clsx from "clsx";

function AccordionSection({ title, subtitle, score, maxMarks, isOpen, onToggle, children }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div>
          <p className="text-lg font-semibold text-ink">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
            {score} / {maxMarks}
          </div>
          <ChevronDown className={clsx("h-5 w-5 text-slate-500 transition", isOpen && "rotate-180")} />
        </div>
      </button>

      {isOpen ? <div className="border-t border-slate-100 px-5 py-5">{children}</div> : null}
    </section>
  );
}

export default AccordionSection;
