import { requireAdmin } from "@/lib/requireAdmin";
import SpellForm from "@/components/spells/SpellsForm/SpellForm";

export default async function NewSpellPage() {
   await requireAdmin();

   return (
      <main className="mx-auto max-w-3xl p-6">
         <h1>Новое заклинание</h1>
         <SpellForm />
      </main>
   );
}
