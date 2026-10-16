import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/getSession";
import { getCharacterById } from "@/lib/data/character";
import { MasterCharacterForm } from "./master-character-form";
import { CharacterSheet } from "@/app/main/profile/character-sheet";

export default async function AdminCharacterPage({
   params,
}: {
   params: Promise<{ characterId: string }>;
}) {
   const session = await getSession();

   if (!session) {
      redirect("/login");
   }
   if (session.role !== "admin") {
      redirect("/profile");
   }

   const { characterId } = await params;
   const id = Number(characterId);

   if (Number.isNaN(id)) {
      notFound();
   }

   const character = await getCharacterById(session, id);
   if (!character) {
      notFound();
   }

   return (
      <div className="flex flex-col lg:flex-row">
         <CharacterSheet character={character} />
         <MasterCharacterForm character={character} />;
      </div>
   );
}
