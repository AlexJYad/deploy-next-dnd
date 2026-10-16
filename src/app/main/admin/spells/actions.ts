"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/getSession";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SIDE_LABEL } from "@/lib/spellFormat";
import type { TablesInsert } from "@/lib/database.types";

export type FormState = { error?: string };

const SIDES = ["light", "dark"] as const;
const TYPES = ["attack", "defense", "buff", "other"] as const;
const EFFECTS = ["damage", "heal"] as const;
const SHAPES = ["circle", "cone", "line", "cube"] as const;
const RANGES = ["self", "touch", "sight", "distance"] as const;

type Side = (typeof SIDES)[number];
type VariantRow = Omit<TablesInsert<"spell_variants">, "spell_id">;

async function isAdmin() {
   const user = await getSession();
   return user?.role === "admin";
}

function parseVariant(
   fd: FormData,
   side: Side,
): { data: VariantRow } | { error: string } {
   const get = (k: string) => String(fd.get(`${side}.${k}`) ?? "").trim();
   const flag = (k: string) => fd.get(`${side}.${k}`) === "on";
   const lines = (k: string) =>
      get(k)
         .split("\n")
         .map((s) => s.trim())
         .filter(Boolean);
   const num = (k: string): number | null =>
      get(k) === "" ? null : Number(get(k));
   const pick = <T extends string>(k: string, allowed: readonly T[]) =>
      (allowed as readonly string[]).includes(get(k)) ? (get(k) as T) : null;

   const level = num("level");
   const mana = num("mana_cost");
   const areaSize = num("area_size");
   const rangeCells = num("range_cells");
   const turns = num("duration_turns");

   if (
      [level, mana, areaSize, rangeCells, turns].some(
         (n) => n !== null && !Number.isInteger(n),
      )
   ) {
      return { error: "числовые поля должны быть целыми числами" };
   }
   if ((level ?? 0) < 0 || (mana ?? 0) < 0) {
      return { error: "уровень и мана не могут быть отрицательными" };
   }
   if ([areaSize, rangeCells, turns].some((n) => n !== null && n <= 0)) {
      return {
         error: "площадь, дальность и длительность должны быть больше 0",
      };
   }

   const effectKind = pick("effect_kind", EFFECTS);
   const effectFormula = get("effect_formula") || null;
   if ((effectKind === null) !== (effectFormula === null)) {
      return { error: "для эффекта нужны и тип, и формула (или оба пустые)" };
   }

   const areaShape = pick("area_shape", SHAPES);
   if ((areaShape === null) !== (areaSize === null)) {
      return { error: "для площади нужны и форма, и размер (или оба пустые)" };
   }

   const rangeKind = pick("range_kind", RANGES);
   if (rangeKind === "distance" && rangeCells === null) {
      return { error: "для дистанции укажите число клеток" };
   }

   return {
      data: {
         side,
         description: get("description"),
         type: pick("type", TYPES) ?? "other",
         level: level ?? 0,
         mana_cost: mana ?? 0,
         cast_time: get("cast_time") || null,
         effect_kind: effectKind,
         effect_formula: effectFormula,
         area_shape: areaShape,
         area_size: areaSize,
         range_kind: rangeKind,
         range_cells: rangeKind === "distance" ? rangeCells : null,
         verbal: flag("verbal"),
         somatic: flag("somatic"),
         duration_turns: turns,
         concentration: flag("concentration"),
         actions: lines("actions"),
         restrictions: lines("restrictions"),
         upcast: get("upcast") || null,
      },
   };
}

export async function saveSpell(fd: FormData): Promise<FormState> {
   if (!(await isAdmin())) return { error: "Нет доступа" };

   const id = String(fd.get("id") ?? "") || null;
   const name = String(fd.get("name") ?? "").trim();
   if (!name) return { error: "Укажите название" };

   const tags = String(fd.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

   const variants: VariantRow[] = [];
   for (const side of SIDES) {
      if (fd.get(`${side}.enabled`) !== "on") continue;
      const res = parseVariant(fd, side);
      if ("error" in res) return { error: `${SIDE_LABEL[side]}: ${res.error}` };
      variants.push(res.data);
   }
   if (variants.length === 0) {
      return { error: "Нужна хотя бы одна версия: светлая или тёмная" };
   }

   let spellId = id;
   if (spellId) {
      const { error } = await supabaseAdmin
         .from("spells")
         .update({ name, tags })
         .eq("id", spellId);
      if (error) return { error: error.message };
   } else {
      const { data, error } = await supabaseAdmin
         .from("spells")
         .insert({ name, tags })
         .select("id")
         .single();
      if (error) return { error: error.message };
      spellId = data.id;
   }

   const { error: upsertError } = await supabaseAdmin
      .from("spell_variants")
      .upsert(
         variants.map((v) => ({ ...v, spell_id: spellId })),
         { onConflict: "spell_id,side" },
      );
   if (upsertError) {
      if (!id) await supabaseAdmin.from("spells").delete().eq("id", spellId);
      return { error: upsertError.message };
   }

   const keep = variants.map((v) => v.side).join(",");
   const { error: deleteError } = await supabaseAdmin
      .from("spell_variants")
      .delete()
      .eq("spell_id", spellId)
      .not("side", "in", `(${keep})`);
   if (deleteError) return { error: deleteError.message };

   revalidatePath("/spells");
   revalidatePath("/main/admin/spells");
   redirect("/main/admin/spells");
}

export async function deleteSpell(id: string): Promise<FormState> {
   if (!(await isAdmin())) return { error: "Нет доступа" };

   const { error } = await supabaseAdmin.from("spells").delete().eq("id", id);
   if (error) return { error: error.message };

   revalidatePath("/spells");
   revalidatePath("/main/admin/spells");
   return {};
}
