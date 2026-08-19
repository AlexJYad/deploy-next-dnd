import { getSession } from "@/lib/getSession";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getRoleRank } from "@/lib/roles";
import MapViewer from "./MapViewer";

export default async function MapsPage() {
   const session = await getSession();
   const userRank = getRoleRank(session?.role);

   const { data: worldMap, error } = await supabaseAdmin
      .from("maps")
      .select("*")
      .is("parent_map_id", null)
      .single();

   if (error || !worldMap) {
      return (
         <div className="p-8 text-center text-[var(--foreground-muted)]">
            Карта мира ещё не добавлена в базу данных.
         </div>
      );
   }

   const { data: markers } = await supabaseAdmin
      .from("map_markers")
      .select("*")
      .eq("map_id", worldMap.id);

   const visibleMarkers = (markers ?? []).filter(
      (m) => getRoleRank(m.min_role) <= userRank,
   );

   return (
      <div className="relative flex-1 min-h-0 w-full">
         <MapViewer initialMap={{ ...worldMap, markers: visibleMarkers }} />
      </div>
   );
}
