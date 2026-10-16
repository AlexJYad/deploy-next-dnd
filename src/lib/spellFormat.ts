import type { SpellVariant, SpellType, SpellSide } from "@/types/spells";

export const TYPE_LABEL: Record<SpellType, string> = {
   attack: "Атака",
   defense: "Защита",
   buff: "Баф",
   other: "Прочее",
};

export const SIDE_LABEL: Record<SpellSide, string> = {
   light: "Свет",
   dark: "Тьма",
};
export const SIDE_ICON: Record<SpellSide, string> = { light: "☀", dark: "🌑" };

const AREA_LABEL = {
   circle: "Круг",
   cone: "Конус",
   line: "Линия",
   cube: "Куб",
} as const;

export const levelLabel = (level: number) =>
   level === 0 ? "Компакт (Заговор)" : String(level);

export function formatRange(v: SpellVariant): string | null {
   switch (v.range_kind) {
      case "self":
         return "На себя";
      case "touch":
         return "Касание";
      case "sight":
         return "Видимость";
      case "distance":
         return `${v.range_cells} кл.`;
      default:
         return null;
   }
}

export function formatArea(v: SpellVariant): string | null {
   if (!v.area_shape || !v.area_size) return null;
   return `${AREA_LABEL[v.area_shape]} ${v.area_size} кл.`;
}

export function formatDuration(v: SpellVariant): string {
   if (v.duration_turns) {
      return v.concentration ?
            `${v.duration_turns} ход., концентрация`
         :  `${v.duration_turns} ход.`;
   }
   return v.concentration ? "Концентрация" : "Мгновенно";
}
