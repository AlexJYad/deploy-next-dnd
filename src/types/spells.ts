import type { Tables } from "@/lib/database.types";

export type SpellHolder = {
   characterId: number;
   name: string | null;
   skill: number | null;
};

export type SpellVariant = Omit<Tables<"spell_variants">, "mana_cost"> & {
   mana_cost: number | null;
   skill: number | null;
   holders?: SpellHolder[];
};

export type Spell = Tables<"spells"> & { variants: SpellVariant[] };
export type SpellType = SpellVariant["type"];
export type SpellSide = SpellVariant["side"];
