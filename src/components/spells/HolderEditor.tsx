"use client";

import { useState, useTransition } from "react";
import type { SpellHolder } from "@/types/spells";
import { setSpellHolder, removeSpellHolder } from "@/app/main/spells/actions";

export type CharacterOption = { id: number; name: string | null };

export default function HolderEditor({
   variantId,
   holders,
   characters,
}: {
   variantId: string;
   holders: SpellHolder[];
   characters: CharacterOption[];
}) {
   const [pending, startTransition] = useTransition();
   const [error, setError] = useState<string | null>(null);
   const [newChar, setNewChar] = useState("");
   const [newSkill, setNewSkill] = useState(10);

   const free = characters.filter(
      (c) => !holders.some((h) => h.characterId === c.id),
   );

   function run(action: () => Promise<{ error?: string }>) {
      setError(null);
      startTransition(async () => {
         const res = await action();
         if (res.error) setError(res.error);
      });
   }

   return (
      <section className="mt-4" aria-busy={pending}>
         <h3 className="font-semibold">Знают:</h3>

         {holders.length === 0 && (
            <p className="mt-1 text-sm opacity-70">Никому не выдано</p>
         )}

         <ul className="mt-1 space-y-1">
            {holders.map((h) => (
               <li key={`${h.characterId}-${h.skill}`} className="holder-row">
                  <span>{h.name ?? `#${h.characterId}`}</span>
                  <label className="text-sm opacity-70">Навык</label>
                  <input
                     type="number"
                     min={3}
                     max={18}
                     defaultValue={h.skill ?? ""}
                     disabled={pending}
                     onBlur={(e) => {
                        const n = Number(e.target.value);
                        if (n !== h.skill) {
                           run(() =>
                              setSpellHolder(variantId, h.characterId, n),
                           );
                        }
                     }}
                     className="spell-stat w-16 rounded-md px-2 py-1"
                  />
                  <button
                     type="button"
                     disabled={pending}
                     onClick={() =>
                        run(() => removeSpellHolder(variantId, h.characterId))
                     }
                     title="Забрать заклинание"
                     className="spell-toggle h-8 w-8 rounded-md"
                  >
                     ✕
                  </button>
               </li>
            ))}
         </ul>

         {free.length > 0 && (
            <div className="holder-add">
               <select
                  value={newChar}
                  onChange={(e) => setNewChar(e.target.value)}
                  disabled={pending}
                  className="spell-stat rounded-md px-2 py-1"
               >
                  <option value="">Выдать персонажу…</option>
                  {free.map((c) => (
                     <option key={c.id} value={c.id}>
                        {c.name ?? `#${c.id}`}
                     </option>
                  ))}
               </select>
               <input
                  type="number"
                  min={3}
                  max={18}
                  value={newSkill}
                  onChange={(e) => setNewSkill(Number(e.target.value))}
                  disabled={pending}
                  className="spell-stat w-16 rounded-md px-2 py-1"
               />
               <button
                  type="button"
                  disabled={pending || !newChar}
                  onClick={() => {
                     run(() =>
                        setSpellHolder(variantId, Number(newChar), newSkill),
                     );
                     setNewChar("");
                  }}
                  className="spell-toggle rounded-md px-3 py-1"
               >
                  Выдать
               </button>
            </div>
         )}

         {error && (
            <p className="mt-2 text-sm text-red-700 dark:text-red-400">
               {error}
            </p>
         )}
      </section>
   );
}
