import type { AppLink } from "@/data/links";

export default function LinkCard({ label, href, icon }: AppLink) {
   return (
      <a
         href={href}
         target="_blank"
         rel="noreferrer"
         className="flex flex-col items-center gap-2 rounded-xl border border-white/20 p-4 text-center transition hover:bg-white/10"
      >
         <span className="text-3xl" aria-hidden>
            {icon}
         </span>
         <span>{label}</span>
      </a>
   );
}
