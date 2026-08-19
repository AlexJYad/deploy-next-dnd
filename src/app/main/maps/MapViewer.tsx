"use client";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import type { MarkerData } from "@/types/maps";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

type MapData = {
   id: string;
   title: string;
   image_url: string;
   width: number;
   height: number;
   markers: MarkerData[];
};

export default function MapViewer({ initialMap }: { initialMap: MapData }) {
   const [stack, setStack] = useState<MapData[]>([initialMap]);
   const [loading, setLoading] = useState(false);
   const cache = useRef<Map<string, MapData>>(new Map());

   const current = stack[stack.length - 1];

   const openChildMap = async (targetMapId: string) => {
      const cached = cache.current.get(targetMapId);
      if (cached) {
         setStack((prev) => [...prev, cached]);
         return;
      }

      setLoading(true);
      try {
         const res = await fetch(`/api/maps/${targetMapId}`);
         if (!res.ok) return; // нет доступа или карта не найдена — просто игнорируем клик
         const mapData: MapData = await res.json();
         cache.current.set(targetMapId, mapData);
         setStack((prev) => [...prev, mapData]);
      } finally {
         setLoading(false);
      }
   };

   const closeTop = () => setStack((prev) => prev.slice(0, -1));

   return (
      <div className="absolute inset-0">
         <LeafletMap map={stack[0]} onMarkerClick={openChildMap} />

         {stack.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-[1000]">
               <div className="relative w-[90%] h-[85%] bg-[var(--bg-1)] border border-[var(--border)] rounded-lg shadow-[var(--shadow-hard)] overflow-hidden flex flex-col">
                  {/* хедер модалки — фиксированной высоты, НЕ absolute */}
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] shrink-0">
                     <span className="font-semibold">{current.title}</span>
                     <button
                        onClick={closeTop}
                        className="px-3 py-1 bg-[var(--bg-2)] rounded"
                     >
                        ✕ Закрыть
                     </button>
                  </div>

                  {/* карта занимает оставшееся место */}
                  <div className="flex-1 min-h-0">
                     <LeafletMap map={current} onMarkerClick={openChildMap} />
                  </div>
               </div>
            </div>
         )}

         {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-[1100]">
               <span className="text-[var(--foreground)]">
                  Загрузка карты...
               </span>
            </div>
         )}
      </div>
   );
}
