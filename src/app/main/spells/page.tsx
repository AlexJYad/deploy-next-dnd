import { redirect } from "next/navigation";
import { getSession } from "@/lib/getSession";
import SkillTree from "@/components/SkillTree/SkillTree";
import { getSpellsForUser } from "@/lib/spells";
import { supabaseAdmin } from "@/lib/supabase/admin";
import SpellList from "@/components/spells/SpellList";

export default async function SpellsPage() {
   const user = await getSession();
   if (!user) redirect("/login");

   const spells = await getSpellsForUser(user);

   const characters =
      user.role === "admin" ?
         ((
            await supabaseAdmin
               .from("characters")
               .select("id, name")
               .order("name")
         ).data ?? [])
      :  undefined;

   return (
      <main className="mx-auto max-w-6xl p-6">
         <h1 className="mb-6 text-3xl">Заклинания</h1>
         <SpellList spells={spells} characters={characters} />
         <SkillTree />
      </main>
   );
}
