// src/components/ui/WorldMap.tsx
import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import type { AvailabilityZone, DataCenter, EdgeLocation, Region, RegionLiveStatus } from "../../types/cloud";
import { STATUS_HEX } from "../../utils/statusColors";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  regions: Region[];
  liveStatus?: RegionLiveStatus[]; // ahora opcional
  availabilityZones?: AvailabilityZone[];
  dataCenters?: DataCenter[];
  edgeLocations?: EdgeLocation[];
  selectedRegionId: string | null;
  onSelectRegion: (id: string) => void;
}

export default function WorldMap({ regions, liveStatus = [], availabilityZones = [], dataCenters = [], edgeLocations = [], selectedRegionId, onSelectRegion }: WorldMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  const liveById = Object.fromEntries(liveStatus.map((s) => [s.regionId, s]));
  const regionById = Object.fromEntries(regions.map((region) => [region.id, region]));
  const markerCoordinates = (regionId: string, index: number, layer: "zone" | "dataCenter" | "edge") => {
    const region = regionById[regionId];
    if (!region) return [0, 0] as [number, number];
    const offsets = layer === "zone"
      ? [[-1.8, 1.4], [1.8, 1.4], [0, -1.8]]
      : layer === "dataCenter"
        ? [[-2.8, -1], [2.8, -1], [0, 2.5]]
        : [[-4.5, 0], [4.5, 0], [0, 4]];
    const [longitudeOffset, latitudeOffset] = offsets[index % offsets.length];
    return [region.longitude + longitudeOffset, region.latitude + latitudeOffset] as [number, number];
  };

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

        {availabilityZones.map((zone, index) => {
          const layerId = `zone-${zone.id}`;
          const region = regionById[zone.regionId];
          if (!region) return null;
          const isHovered = hoveredLayerId === layerId;
          return (
            <Marker key={layerId} coordinates={markerCoordinates(zone.regionId, index, "zone")}>
              <circle r={isHovered ? 3.8 : 2.8} fill="#2563EB" stroke="#FFFFFF" strokeWidth={1} onMouseEnter={() => setHoveredLayerId(layerId)} onMouseLeave={() => setHoveredLayerId(null)} />
              {isHovered && <g transform="translate(6, -7)"><rect x={0} y={-13} width={Math.max(84, zone.code.length * 6)} height={25} rx={4} fill="#0F172A" /><text x={6} y={3} fontSize={8.5} fill="#FFFFFF">{zone.code} · {region.code}</text></g>}
            </Marker>
          );
        })}

        {dataCenters.map((center, index) => {
          const layerId = `data-center-${center.id}`;
          const region = regionById[center.regionId];
          if (!region) return null;
          const isHovered = hoveredLayerId === layerId;
          return (
            <Marker key={layerId} coordinates={markerCoordinates(center.regionId, index, "dataCenter")}>
              <circle r={isHovered ? 4.2 : 3.2} fill="#16A34A" stroke="#FFFFFF" strokeWidth={1} onMouseEnter={() => setHoveredLayerId(layerId)} onMouseLeave={() => setHoveredLayerId(null)} />
              {isHovered && <g transform="translate(6, -7)"><rect x={0} y={-13} width={Math.max(92, center.name.length * 5.3)} height={25} rx={4} fill="#0F172A" /><text x={6} y={3} fontSize={8.5} fill="#FFFFFF">{center.name}</text></g>}
            </Marker>
          );
        })}

        {edgeLocations.map((edge, index) => {
          const layerId = `edge-${edge.id}`;
          const region = regionById[edge.regionId];
          if (!region) return null;
          const isHovered = hoveredLayerId === layerId;
          return (
            <Marker key={layerId} coordinates={markerCoordinates(edge.regionId, index, "edge")}>
              <circle r={isHovered ? 4.2 : 3.2} fill="#EA580C" stroke="#FFFFFF" strokeWidth={1} onMouseEnter={() => setHoveredLayerId(layerId)} onMouseLeave={() => setHoveredLayerId(null)} />
              {isHovered && <g transform="translate(6, -7)"><rect x={0} y={-13} width={Math.max(84, edge.name.length * 5.5)} height={25} rx={4} fill="#0F172A" /><text x={6} y={3} fontSize={8.5} fill="#FFFFFF">{edge.name}</text></g>}
            </Marker>
          );
        })}

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
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 text-[11px] text-text-secondary">
        <span className="inline-flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-full bg-primary" /> Región</span>
        <span className="inline-flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Zona de disponibilidad</span>
        <span className="inline-flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-full bg-green-600" /> Centro de datos</span>
        <span className="inline-flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-full bg-orange-600" /> Ubicación de borde</span>
      </div>
    </div>
  );
}