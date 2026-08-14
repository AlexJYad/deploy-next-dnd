import type { Tables } from "@/lib/database.types";

export type MarkerRow = Tables<"map_markers">;
export type MapRow = Tables<"maps">;

export type MapData = MapRow & {
   markers: MarkerRow[];
};

export type MarkerData = MarkerRow;
