import Link from "next/link";
import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SIDE_ICON, TYPE_LABEL } from "@/lib/spellFormat";
import type { SpellSide, SpellType } from "@/types/spells";
import DeleteSpellButton from "@/components/spells/DeleteSpellButton";
import "@/components/spells/SpellsForm/SpellForm.css";

type Row = {
   id: string;
   name: string;
   variants: { side: SpellSide; type: SpellType }[];
};

export default async function WorkshopSpellsPage() {
   await requireAdmin();

   const { data } = await supabaseAdmin
      .from("spells")
      .select("id, name, variants:spell_variants(side, type)")
      .order("name");
   const spells = (data ?? []) as unknown as Row[];

   return (
      <main className="mx-auto max-w-3xl p-6">
         <h1>Заклинания</h1>

         <div className="sf-actions">
            <Link href="/main/admin/spells/new" className="btn-primary">
               + Новое заклинание
            </Link>
         </div>

         {spells.length === 0 ?
            <p className="sf-empty">Заклинаний пока нет.</p>
         :  <ul className="sf-list">
               {spells.map((s) => (
                  <li key={s.id} className="sf-list-item">
                     <span className="sf-list-name">{s.name}</span>
                     <span className="sf-list-meta">
                        {s.variants.map((v) => SIDE_ICON[v.side]).join(" ")}
                        {" · "}
                        {[
                           ...new Set(
                              s.variants.map((v) => TYPE_LABEL[v.type]),
                           ),
                        ].join(", ")}
                     </span>
                     <Link
                        href={`/main/admin/spells/${s.id}`}
                        className="sf-btn"
                     >
                        Изменить
                     </Link>
                     <DeleteSpellButton id={s.id} name={s.name} />
                  </li>
               ))}
            </ul>
         }
      </main>
   );
}
