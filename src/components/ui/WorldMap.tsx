// src/components/ui/WorldMap.tsx
import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import type { Region, RegionLiveStatus } from "../../types/cloud";
import { STATUS_HEX } from "../../utils/statusColors";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  regions: Region[];
  liveStatus?: RegionLiveStatus[]; // ahora opcional
  selectedRegionId: string | null;
  onSelectRegion: (id: string) => void;
}

export default function WorldMap({ regions, liveStatus = [], selectedRegionId, onSelectRegion }: WorldMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const liveById = Object.fromEntries(liveStatus.map((s) => [s.regionId, s]));

  return (
    <div className="relative">
      <ComposableMap projectionConfig={{ scale: 140 }} style={{ width: "100%", height: "auto" }}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#E2E8F0"
                stroke="#F8FAFC"
                strokeWidth={0.5}
                style={{ outline: "none" }}
              />
            ))
          }
        </Geographies>

        {regions.map((region) => {
          const live = liveById[region.id];
          const isSelected = selectedRegionId === region.id;
          const isHovered = hoveredId === region.id;
          const color = STATUS_HEX[region.status];

          return (
            <Marker
              key={region.id}
              coordinates={[region.longitude, region.latitude]}
              onMouseEnter={() => setHoveredId(region.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectRegion(region.id)}
              style={{ cursor: "pointer" } }
            >
              {isSelected && (
                <circle r={10} fill={color} opacity={0.25}>
                  <animate attributeName="r" from="8" to="16" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.35" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
              <circle r={isSelected || isHovered ? 7 : 5.5} fill={color} stroke="#FFFFFF" strokeWidth={2} />

              {(isHovered || isSelected) && (
                <g transform="translate(10, -10)">
                  <rect
                    x={0}
                    y={-14}
                    width={Math.max(90, region.name.length * 6.5)}
                    height={live ? 40 : 24}
                    rx={6}
                    fill="#0F172A"
                  />
                  <text x={8} y={0} fontSize={11} fontWeight={600} fill="#FFFFFF">
                    {region.name}
                  </text>
                  {live ? (
                    <text x={8} y={14} fontSize={9} fill="#94A3B8">
                      {live.latency}ms · {live.load}% carga
                    </text>
                  ) : (
                    <text x={8} y={14} fontSize={9} fill="#94A3B8">
                      {region.deployedServices.length} servicio(s)
                    </text>
                  )}
                </g>
              )}
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}