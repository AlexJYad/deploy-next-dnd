import { supabaseAdmin } from "@/lib/supabase/admin";
import type { SessionUser } from "@/lib/session";
import type { Tables } from "@/lib/database.types";
import type { Spell, SpellHolder } from "@/types/spells";

type Row = {
   skill: number | null;
   variant: (Tables<"spell_variants"> & { spell: Tables<"spells"> }) | null;
};

export async function getSpellsForUser(user: SessionUser): Promise<Spell[]> {
   if (user.role === "admin") {
      const [{ data: spellRows }, { data: grants }] = await Promise.all([
         supabaseAdmin
            .from("spells")
            .select("*, variants:spell_variants(*)")
            .order("name"),
         supabaseAdmin
            .from("character_spells")
            .select("variant_id, skill, character:characters(id, name)"),
      ]);

      const holdersByVariant = new Map<string, SpellHolder[]>();
      for (const g of (grants ?? []) as unknown as {
         variant_id: string;
         skill: number | null;
         character: { id: number; name: string | null } | null;
      }[]) {
         if (!g.character) continue;
         const list = holdersByVariant.get(g.variant_id) ?? [];
         list.push({
            characterId: g.character.id,
            name: g.character.name,
            skill: g.skill,
         });
         holdersByVariant.set(g.variant_id, list);
      }

      const rows = (spellRows ?? []) as unknown as (Tables<"spells"> & {
         variants: Tables<"spell_variants">[];
      })[];

      return rows.map((s) => ({
         ...s,
         variants: s.variants.map((v) => ({
            ...v,
            skill: null,
            holders: (holdersByVariant.get(v.id) ?? []).sort((a, b) =>
               (a.name ?? "").localeCompare(b.name ?? ""),
            ),
         })),
      }));
   }

   const { data: character } = await supabaseAdmin
      .from("characters")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
   if (!character) return [];

   const { data } = await supabaseAdmin
      .from("character_spells")
      .select("skill, variant:spell_variants(*, spell:spells(*))")
      .eq("character_id", character.id);

   const bySpell = new Map<string, Spell>();
   for (const { skill, variant } of (data ?? []) as unknown as Row[]) {
      if (!variant) continue;
      const { spell, ...v } = variant;
      const entry: Spell = bySpell.get(spell.id) ?? { ...spell, variants: [] };
      entry.variants.push({ ...v, mana_cost: null, skill });
      bySpell.set(spell.id, entry);
   }

   const spells = [...bySpell.values()];
   for (const s of spells) {
      s.variants.sort((a, b) =>
         a.side === b.side ? 0
         : a.side === "light" ? -1
         : 1,
      );
   }
   return spells;
}
