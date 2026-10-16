"use client";

import Image from "next/image";
import type { Spell, SpellSide } from "@/types/spells";
import {
   TYPE_LABEL,
   SIDE_LABEL,
   SIDE_ICON,
   levelLabel,
   formatRange,
   formatArea,
   formatDuration,
} from "@/lib/spellFormat";
import HolderEditor, { type CharacterOption } from "./HolderEditor";
import "./SpellCard.css";
import { useEffect, useRef, useState } from "react";
import RunicText from "./RunicText";

export default function SpellCard({
   spell,
   characters = [],
}: {
   spell: Spell;
   characters?: CharacterOption[];
}) {
   const [side, setSide] = useState<SpellSide>(spell.variants[0].side);
   const textRef = useRef<HTMLDivElement>(null);
   const [open, setOpen] = useState(false);
   const [clipped, setClipped] = useState(false);

   useEffect(() => {
      const el = textRef.current;
      if (!el) return;
      const measure = () => {
         if (!open) setClipped(el.scrollHeight > el.clientHeight + 1);
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
   }, [open, side]);
   const v = spell.variants.find((x) => x.side === side) ?? spell.variants[0];
   const other = spell.variants.find((x) => x.side !== side);
   const badge =
      v.mana_cost !== null ?
         { label: "Мана", value: v.mana_cost, title: "Стоимость в мане" }
      : v.skill !== null ?
         { label: "Навык", value: v.skill, title: "Навык персонажа" }
      :  null;

   const stats = (
      [
         // ["Уровень", levelLabel(v.level)],
         ["Тип", TYPE_LABEL[v.type]],
         ["Время", v.cast_time],
         ["Длительность", formatDuration(v)],
         ["Дальность", formatRange(v)],
         [v.effect_kind === "heal" ? "Лечение" : "Урон", v.effect_formula],
         ["Площадь", formatArea(v)],
      ] as [string, string | null][]
   ).filter((s): s is [string, string] => !!s[1]);

   return (
      <article
         data-side={side}
         className={`spell-card${badge ? " spell-card--flag" : ""}`}
      >
         <header className="spell-head">
            <h2 className="spell-title" title={spell.name}>
               <RunicText enabled={v.runic} text={spell.name} />
            </h2>

            {other && (
               <button
                  type="button"
                  onClick={() => setSide(other.side)}
                  className="spell-side-btn"
                  title={`${SIDE_LABEL[side]} → ${SIDE_LABEL[other.side]}`}
                  aria-label={`Сторона: ${SIDE_LABEL[side]}. Переключить на: ${SIDE_LABEL[other.side]}`}
               >
                  {SIDE_ICON[side]}
               </button>
            )}

            {badge && (
               <div className="spell-pennant-wrap" title={badge.title}>
                  <div className="spell-pennant">
                     <span>{badge.label}</span>
                     <b>{badge.value}</b>
                  </div>
               </div>
            )}
         </header>
         <div className="spell-text">
            <div
               ref={textRef}
               className={`spell-lines${open ? "" : " spell-lines--collapsed"}`}
            >
               <p className="spell-desc">
                  <RunicText
                     enabled={v.runic}
                     text={v.description}
                     mode="reveal"
                  />
               </p>

               {v.actions.length > 0 && (
                  <>
                     <div className="spell-gap" aria-hidden />
                     <h3>Доступные действия:</h3>
                     <ul>
                        {v.actions.map((a) => (
                           <li key={a}>✦ {a}</li>
                        ))}
                     </ul>
                  </>
               )}

               {v.restrictions.length > 0 && (
                  <ul>
                     {v.restrictions.map((r) => (
                        <li key={r} className="spell-warn">
                           ❖ {r}
                        </li>
                     ))}
                  </ul>
               )}

               {v.upcast && (
                  <p className="spell-upcast">Усиление: {v.upcast}</p>
               )}
            </div>
            {clipped && !open && (
               <button
                  type="button"
                  className="spell-more"
                  onClick={() => setOpen(true)}
                  aria-expanded={false}
                  aria-label="Показать полностью"
               >
                  ...
               </button>
            )}
            {clipped && open && (
               <button
                  type="button"
                  className="spell-less"
                  onClick={() => setOpen(false)}
                  aria-expanded
               >
                  свернуть ▲
               </button>
            )}
         </div>
         <dl className="spell-tiles">
            {stats.map(([label, value]) => (
               <div key={label} className="spell-tile">
                  <dt>{label}</dt>
                  <dd>
                     <RunicText enabled={v.runic} text={value} />
                  </dd>
               </div>
            ))}

            {(v.verbal || v.somatic || v.material) && (
               <div className="spell-tile spell-tile--wide">
                  <dt>Компоненты</dt>
                  <dd className="spell-components">
                     {v.verbal && (
                        <span
                           className={`spell-component${v.runic ? " spell-component--flicker" : ""}`}
                        >
                           <Image
                              src="/images/spells/verbal.webp"
                              alt=""
                              width={64}
                              height={64}
                           />
                        </span>
                     )}
                     {v.somatic && (
                        <span
                           className={`spell-component${v.runic ? " spell-component--flicker" : ""}`}
                        >
                           <Image
                              src="/images/spells/somatic.webp"
                              alt=""
                              width={64}
                              height={64}
                           />
                        </span>
                     )}
                     {v.material && (
                        <span
                           className={`spell-component${v.runic ? " spell-component--flicker" : ""}`}
                        >
                           <Image
                              src="/images/spells/material.webp"
                              alt=""
                              width={64}
                              height={64}
                           />
                        </span>
                     )}
                  </dd>
               </div>
            )}
         </dl>

         {v.holders && (
            <HolderEditor
               variantId={v.id}
               holders={v.holders}
               characters={characters}
            />
         )}
      </article>
   );
}
