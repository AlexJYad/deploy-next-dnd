"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/getSession";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Result = { error?: string };

async function isAdmin() {
   const user = await getSession();
   return user?.role === "admin";
}

export async function setSpellHolder(
   variantId: string,
   characterId: number,
   skill: number,
): Promise<Result> {
   if (!(await isAdmin())) return { error: "Нет доступа" };
   if (!Number.isInteger(skill) || skill < 3 || skill > 18) {
      return { error: "Навык должен быть от 3 до 18" };
   }

   const { error } = await supabaseAdmin
      .from("character_spells")
      .upsert(
         { character_id: characterId, variant_id: variantId, skill },
         { onConflict: "character_id,variant_id" },
      );
   if (error) return { error: error.message };

   revalidatePath("/spells");
   return {};
}

export async function removeSpellHolder(
   variantId: string,
   characterId: number,
): Promise<Result> {
   if (!(await isAdmin())) return { error: "Нет доступа" };

   const { error } = await supabaseAdmin
      .from("character_spells")
      .delete()
      .eq("variant_id", variantId)
      .eq("character_id", characterId);
   if (error) return { error: error.message };

   revalidatePath("/spells");
   return {};
}
