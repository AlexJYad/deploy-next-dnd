"use client";

import { useEffect, useRef, useState } from "react";
import "./D20Roller.css";

export default function D20Roller() {
   const [value, setValue] = useState<number | null>(null);
   const [rolling, setRolling] = useState(false);
   const timer = useRef<ReturnType<typeof setInterval> | null>(null);

   useEffect(
      () => () => {
         if (timer.current) clearInterval(timer.current);
      },
      [],
   );

   function roll() {
      if (rolling) return;
      setRolling(true);

      let ticks = 0;
      timer.current = setInterval(() => {
         setValue(Math.floor(Math.random() * 20) + 1);
         ticks++;
         if (ticks >= 10) {
            clearInterval(timer.current!);
            setRolling(false);
         }
      }, 60);
   }

   const status =
      rolling || value === null ? ""
      : value === 20 ? "crit"
      : value === 1 ? "fail"
      : "";

   return (
      <div className="d20">
         <button
            type="button"
            onClick={roll}
            disabled={rolling}
            className={`d20-die ${rolling ? "rolling" : ""} ${status}`}
            aria-label={`Бросить d20. Результат: ${value ?? "не брошен"}`}
            aria-live="polite"
         >
            <svg viewBox="0 0 200 200" aria-hidden="true">
               <defs>
                  <linearGradient id="d20-face" x1="0" y1="0" x2="1" y2="1">
                     <stop offset="0%" className="d20-stop-light" />
                     <stop offset="100%" className="d20-stop-dark" />
                  </linearGradient>
               </defs>

               <polygon
                  className="d20-body"
                  points="100,10 177.9,55 177.9,145 100,190 22.1,145 22.1,55"
                  fill="url(#d20-face)"
                  strokeWidth="4"
                  strokeLinejoin="round"
               />

               <g
                  className="d20-edges"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinejoin="round"
               >
                  <polygon
                     className="d20-center"
                     points="100,45 147.6,127.5 52.4,127.5"
                  />
                  <path d="M100 45 L100 10 M100 45 L22.1 55 M100 45 L177.9 55" />
                  <path d="M147.6 127.5 L177.9 55 M147.6 127.5 L177.9 145 M147.6 127.5 L100 190" />
                  <path d="M52.4 127.5 L22.1 55 M52.4 127.5 L22.1 145 M52.4 127.5 L100 190" />
               </g>

               <text
                  className="d20-number"
                  x="100"
                  y="102"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={value !== null && value >= 10 ? 36 : 44}
                  fontWeight="700"
               >
                  {value ?? "20"}
               </text>
            </svg>
         </button>
         {/* <p className="d20-hint">
            {rolling ?
               "Бросаем…"
            : value === 20 ?
               "Критический успех!"
            : value === 1 ?
               "Критический провал…"
            :  "Нажми на кубик"}
         </p> */}
      </div>
   );
}
