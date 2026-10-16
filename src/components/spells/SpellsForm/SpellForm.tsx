"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import type { Tables } from "@/lib/database.types";
import type { SpellSide } from "@/types/spells";
import { SIDE_ICON, SIDE_LABEL, TYPE_LABEL } from "@/lib/spellFormat";
import { saveSpell } from "@/app/main/admin/spells/actions";
import "./SpellForm.css";

export type SpellFormData = Tables<"spells"> & {
   variants: Tables<"spell_variants">[];
};

const SIDES: SpellSide[] = ["light", "dark"];

const EFFECT_OPTIONS = [
   ["", "Нет"],
   ["damage", "Урон"],
   ["heal", "Лечение"],
];
const AREA_OPTIONS = [
   ["", "Нет"],
   ["circle", "Круг"],
   ["cone", "Конус"],
   ["line", "Линия"],
   ["cube", "Куб"],
];
const RANGE_OPTIONS = [
   ["", "Нет"],
   ["self", "На себя"],
   ["touch", "Касание"],
   ["sight", "Видимость"],
   ["distance", "Дистанция (клетки)"],
];

function Field({
   label,
   wide,
   children,
}: {
   label: string;
   wide?: boolean;
   children: ReactNode;
}) {
   return (
      <label className={`sf-field${wide ? " sf-field--wide" : ""}`}>
         <span>{label}</span>
         {children}
      </label>
   );
}

function Options({ items }: { items: string[][] }) {
   return items.map(([value, label]) => (
      <option key={value} value={value}>
         {label}
      </option>
   ));
}

function VariantFields({
   side,
   v,
}: {
   side: SpellSide;
   v?: Tables<"spell_variants">;
}) {
   const n = (k: string) => `${side}.${k}`;

   return (
      <>
         <Field label="Описание" wide>
            <textarea
               name={n("description")}
               rows={4}
               defaultValue={v?.description ?? ""}
            />
         </Field>

         <Field label="Тип">
            <select name={n("type")} defaultValue={v?.type ?? "other"}>
               {Object.entries(TYPE_LABEL).map(([k, label]) => (
                  <option key={k} value={k}>
                     {label}
                  </option>
               ))}
            </select>
         </Field>
         <Field label="Уровень (0 = Компакт)">
            <input
               type="number"
               min={0}
               name={n("level")}
               defaultValue={v?.level ?? 0}
            />
         </Field>
         <Field label="Мана">
            <input
               type="number"
               min={0}
               name={n("mana_cost")}
               defaultValue={v?.mana_cost ?? 0}
            />
         </Field>
         <Field label="Время накладывания">
            <input
               name={n("cast_time")}
               placeholder="Действие"
               defaultValue={v?.cast_time ?? ""}
            />
         </Field>

         <Field label="Эффект">
            <select name={n("effect_kind")} defaultValue={v?.effect_kind ?? ""}>
               <Options items={EFFECT_OPTIONS} />
            </select>
         </Field>
         <Field label="Формула эффекта">
            <input
               name={n("effect_formula")}
               placeholder="2d6"
               defaultValue={v?.effect_formula ?? ""}
            />
         </Field>

         <Field label="Площадь">
            <select name={n("area_shape")} defaultValue={v?.area_shape ?? ""}>
               <Options items={AREA_OPTIONS} />
            </select>
         </Field>
         <Field label="Размер площади (клетки)">
            <input
               type="number"
               min={1}
               name={n("area_size")}
               defaultValue={v?.area_size ?? ""}
            />
         </Field>

         <Field label="Дальность">
            <select name={n("range_kind")} defaultValue={v?.range_kind ?? ""}>
               <Options items={RANGE_OPTIONS} />
            </select>
         </Field>
         <Field label="Клетки (для дистанции)">
            <input
               type="number"
               min={1}
               name={n("range_cells")}
               defaultValue={v?.range_cells ?? ""}
            />
         </Field>

         <Field label="Длительность (ходы, пусто = мгновенно)">
            <input
               type="number"
               min={1}
               name={n("duration_turns")}
               defaultValue={v?.duration_turns ?? ""}
            />
         </Field>

         <div className="sf-checks">
            <label className="sf-check">
               <input
                  type="checkbox"
                  name={n("concentration")}
                  defaultChecked={v?.concentration}
               />
               Концентрация
            </label>
            <label className="sf-check">
               <input
                  type="checkbox"
                  name={n("verbal")}
                  defaultChecked={v?.verbal}
               />
               Слова
            </label>
            <label className="sf-check">
               <input
                  type="checkbox"
                  name={n("somatic")}
                  defaultChecked={v?.somatic}
               />
               Руки
            </label>
            <label className="sf-check">
               <input
                  type="checkbox"
                  name={n("material")}
                  defaultChecked={v?.material}
               />
               Предмет
            </label>
            <label className="sf-check">
               <input
                  type="checkbox"
                  name={n("runic")}
                  defaultChecked={v?.runic}
               />
               Рунический
            </label>
         </div>

         <Field label="Доступные действия (по одному в строке)" wide>
            <textarea
               name={n("actions")}
               rows={3}
               defaultValue={v?.actions.join("\n") ?? ""}
            />
         </Field>
         <Field label="Ограничения (по одному в строке)" wide>
            <textarea
               name={n("restrictions")}
               rows={2}
               defaultValue={v?.restrictions.join("\n") ?? ""}
            />
         </Field>
         <Field label="Усиление" wide>
            <input name={n("upcast")} defaultValue={v?.upcast ?? ""} />
         </Field>
      </>
   );
}

export default function SpellForm({ spell }: { spell?: SpellFormData }) {
   const [pending, startTransition] = useTransition();
   const [error, setError] = useState<string | null>(null);

   const variantOf = (side: SpellSide) =>
      spell?.variants.find((v) => v.side === side);

   const [tab, setTab] = useState<SpellSide>(
      spell?.variants[0]?.side ?? "light",
   );
   const [enabled, setEnabled] = useState<Record<SpellSide, boolean>>({
      light: spell ? !!variantOf("light") : true,
      dark: spell ? !!variantOf("dark") : false,
   });

   function onSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      setError(null);
      startTransition(async () => {
         const res = await saveSpell(fd); // при успехе сервер сам делает redirect
         if (res?.error) setError(res.error);
      });
   }

   return (
      <form onSubmit={onSubmit} className="spell-form">
         {spell && <input type="hidden" name="id" value={spell.id} />}

         <section className="sf-grid">
            <Field label="Название" wide>
               <input name="name" required defaultValue={spell?.name ?? ""} />
            </Field>
            <Field label="Теги (через запятую)" wide>
               <input name="tags" defaultValue={spell?.tags.join(", ") ?? ""} />
            </Field>
         </section>

         <div className="sf-tabs" role="group" aria-label="Версия заклинания">
            {SIDES.map((side) => (
               <button
                  key={side}
                  type="button"
                  className="sf-tab"
                  aria-pressed={tab === side}
                  onClick={() => setTab(side)}
               >
                  {SIDE_ICON[side]} {SIDE_LABEL[side]}
                  {!enabled[side] && " · нет"}
               </button>
            ))}
         </div>

         {SIDES.map((side) => (
            <div
               key={side}
               hidden={tab !== side}
               data-side={side}
               className="sf-panel"
            >
               <label className="sf-check">
                  <input
                     type="checkbox"
                     name={`${side}.enabled`}
                     checked={enabled[side]}
                     onChange={(e) =>
                        setEnabled((s) => ({ ...s, [side]: e.target.checked }))
                     }
                  />
                  Есть {side === "light" ? "светлая" : "тёмная"} версия
               </label>
               {spell && variantOf(side) && !enabled[side] && (
                  <p className="sf-warn">
                     При сохранении версия будет удалена и заберётся у всех
                     игроков.
                  </p>
               )}
               <fieldset disabled={!enabled[side]} className="sf-grid">
                  <VariantFields side={side} v={variantOf(side)} />
               </fieldset>
            </div>
         ))}

         {error && (
            <p className="sf-error" role="alert">
               {error}
            </p>
         )}

         <div className="sf-actions">
            <button type="submit" disabled={pending} className="btn-primary">
               {pending ? "Сохраняю…" : "Сохранить"}
            </button>
            <Link href="/main/admin/spells" className="sf-btn">
               Отмена
            </Link>
         </div>
      </form>
   );
}
