// app/api/maps/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/getSession";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getRoleRank } from "@/lib/roles";
import type { MapData } from "@/types/maps";

export async function GET(
   req: NextRequest,
   { params }: { params: Promise<{ id: string }> },
) {
   const { id } = await params;

   const session = await getSession();
   const userRank = getRoleRank(session?.role);

   const { data: map, error } = await supabaseAdmin
      .from("maps")
      .select("*")
      .eq("id", id)
      .single();

   if (error || !map) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
   }

   if (getRoleRank(map.min_role) > userRank) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
   }

   const { data: markers } = await supabaseAdmin
      .from("map_markers")
      .select("*")
      .eq("map_id", id);

   const visibleMarkers = (markers ?? []).filter(
      (m) => getRoleRank(m.min_role) <= userRank,
   );

   const response: MapData = { ...map, markers: visibleMarkers };

   return NextResponse.json(response);
}
