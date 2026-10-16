"use client";

import { useEffect, useState } from "react";

const range = (from: number, to: number) =>
   Array.from({ length: to - from + 1 }, (_, i) =>
      String.fromCodePoint(from + i),
   );

const GLYPHS = [...range(0x103a0, 0x103c3), ...range(0x103c8, 0x103cf)];
const rand = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
const keep = (ch: string) => ch === " " || ch === "\n";

type Mode = "noise" | "reveal";

const placeholder = (text: string) =>
   Array.from(text)
      .map((ch) => (keep(ch) ? ch : GLYPHS[0]))
      .join("");

function useScramble(text: string, mode: Mode, interval: number, on: boolean) {
   const [out, setOut] = useState(() => placeholder(text));

   useEffect(() => {
      if (!on) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
         setOut(text);
         return;
      }

      let i = 0;
      const tick = () => {
         setOut(
            Array.from(text)
               .map((ch, idx) =>
                  keep(ch) ? ch
                  : mode === "reveal" && idx < i ? ch
                  : rand(),
               )
               .join(""),
         );
         i = i >= text.length ? 0 : i + 1;
      };

      tick();
      const id = setInterval(tick, interval);
      return () => clearInterval(id);
   }, [text, mode, interval, on]);

   return out;
}

export default function RunicText({
   text,
   enabled = true,
   mode = "noise",
   interval = mode === "noise" ? 200 : 500,
}: {
   text: string;
   enabled?: boolean;
   mode?: Mode;
   interval?: number;
}) {
   const out = useScramble(text, mode, interval, enabled);
   if (!enabled) return <>{text}</>;

   return (
      <span className="runic">
         <span className="sr-only">{text}</span>
         <span aria-hidden>{out}</span>
      </span>
   );
}
