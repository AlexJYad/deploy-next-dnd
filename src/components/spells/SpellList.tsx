"use client";

import { useState } from "react";
import type { Spell, SpellType } from "@/types/spells";
import { TYPE_LABEL } from "@/lib/spellFormat";
import SpellCard from "./SpellCard";
import type { CharacterOption } from "./HolderEditor";

type Filter = SpellType | "all";
const FILTERS: Filter[] = ["all", "attack", "defense", "buff", "other"];

export default function SpellList({
   spells,
   characters,
}: {
   spells: Spell[];
   characters?: CharacterOption[];
}) {
   const [filter, setFilter] = useState<Filter>("all");

   const visible = spells.filter(
      (s) =>
         s.variants.length > 0 &&
         (filter === "all" || s.variants.some((v) => v.type === filter)),
   );

   return (
      <>
         <div className="mb-6 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
               <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className="spell-toggle rounded-full px-4 py-1.5"
               >
                  {f === "all" ? "Все" : TYPE_LABEL[f]}
               </button>
            ))}
         </div>

         {visible.length === 0 ?
            <p className="opacity-70">Заклинаний нет.</p>
         :  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
               {visible.map((s) => (
                  <SpellCard key={s.id} spell={s} characters={characters} />
               ))}
            </div>
         }
      </>
   );
}
