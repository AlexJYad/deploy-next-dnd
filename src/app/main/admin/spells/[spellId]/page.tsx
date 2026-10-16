import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import SpellForm, {
   type SpellFormData,
} from "@/components/spells/SpellsForm/SpellForm";

export default async function EditSpellPage({
   params,
}: {
   params: Promise<{ spellId: string }>;
}) {
   await requireAdmin();

   const { spellId } = await params;

   const { data } = await supabaseAdmin
      .from("spells")
      .select("*, variants:spell_variants(*)")
      .eq("id", spellId)
      .maybeSingle();

   if (!data) notFound();

   return (
      <main className="mx-auto max-w-3xl p-6">
         <h1>Изменить заклинание</h1>
         <SpellForm spell={data as unknown as SpellFormData} />
      </main>
   );
}
