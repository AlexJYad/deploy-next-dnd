// LeafletMap.tsx
"use client";
import { MapContainer, ImageOverlay, Marker, useMap } from "react-leaflet";
import { CRS, LatLngBoundsExpression, divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LeafletMap({
   map,
   onMarkerClick,
}: {
   map: { image_url: string; width: number; height: number; markers: any[] };
   onMarkerClick: (targetMapId: string) => void;
}) {
   const bounds: LatLngBoundsExpression = [
      [0, 0],
      [map.height, map.width],
   ];

   return (
      <MapContainer
         key={map.image_url}
         crs={CRS.Simple}
         bounds={bounds}
         style={{ height: "100%", width: "100%" }}
         minZoom={-2}
      >
         <ClickLogger />
         <ImageOverlay url={map.image_url} bounds={bounds} />
         {map.markers.map((m) => (
            <Marker
               key={m.id}
               position={[m.y, m.x]}
               icon={getIconForType(m.icon_type)}
               eventHandlers={{
                  click: () => {
                     if (m.target_map_id) onMarkerClick(m.target_map_id);
                     else if (m.link) window.location.href = m.link;
                  },
               }}
            />
         ))}
      </MapContainer>
   );
}

function getIconForType(type: string) {
   const icons: Record<string, string> = {
      city: "🏰",
      tavern: "🍺",
      temple: "⛪",
      dungeon: "💀",
      default: "📍",
   };
   return divIcon({
      html: `<div style="font-size: 24px">${icons[type] ?? icons.default}</div>`,
      className: "",
      iconSize: [30, 30],
   });
}

import { useMapEvents } from "react-leaflet";

function ClickLogger() {
   useMapEvents({
      click: (e) => {
         console.log(
            "x:",
            Math.round(e.latlng.lng),
            "y:",
            Math.round(e.latlng.lat),
         );
      },
   });
   return null;
}
