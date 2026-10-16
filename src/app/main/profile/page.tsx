import { redirect } from "next/navigation";
import { getSession } from "@/lib/getSession";
import { getCharacter } from "@/lib/data/character";
import { CharacterForm } from "./character-form";
import { CharacterSheet } from "./character-sheet";

type InventoryItem = { name: string; quantity: number };

export default async function ProfilePage() {
   const session = await getSession();

   if (!session) {
      redirect("/login");
   }

   const character = await getCharacter(session);

   const inventory: InventoryItem[] =
      Array.isArray(character.inventory) ?
         (character.inventory as InventoryItem[])
      :  [];

   return (
      <div className="flex">
         <CharacterSheet character={character} />
         <CharacterForm
            character={{
               ...character,
               name: character.name ?? "",
               notes: character.notes ?? null,
               inventory,
            }}
         />
      </div>
   );
}
