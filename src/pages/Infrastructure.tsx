// src/pages/Infrastructure.tsx
import { Activity, MapPinned, Server, ShieldCheck } from "lucide-react";
import Header from "../components/layout/Header";
import RegionCard from "../components/ui/RegionCard";
import WorldMap from "../components/ui/WorldMap";
import { regions } from "../data/regions";
import { useCloudData } from "../context/CloudDataContext";
import { inputClasses } from "../utils/formStyles";

export default function Infrastructure() {
  const { selectedRegionId, setSelectedRegionId } = useCloudData();
  const selectedRegion = regions.find((region) => region.id === selectedRegionId) ?? regions[0];

  return (
    <div>
      <Header
        title="Infraestructura Global"
        subtitle="Regiones AWS, ubicación, servicios desplegados y estado"
      />

      <div className="bg-card border border-border rounded-card shadow-card p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">Región de trabajo</p>
          <p className="text-xs text-text-secondary mt-0.5">La selección se comparte con Planificación y se guarda localmente.</p>
        </div>
        <select className={`${inputClasses} sm:max-w-xs`} value={selectedRegion.id} onChange={(event) => setSelectedRegionId(event.target.value)}>
          {regions.map((region) => <option key={region.id} value={region.id}>{region.code} · {region.name}</option>)}
        </select>
      </div>

      <div className="bg-card border border-border rounded-card shadow-card p-3 sm:p-4 mb-6 overflow-hidden">
        <WorldMap
          regions={regions}
          selectedRegionId={selectedRegionId}
          onSelectRegion={setSelectedRegionId}
        />
      </div>

      <div className="bg-card border border-primary/20 rounded-card shadow-card p-5 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div><p className="text-xs uppercase tracking-wide text-primary font-semibold">Región seleccionada</p><h2 className="text-xl font-bold text-text-primary mt-1">{selectedRegion.name}</h2><p className="text-sm text-text-secondary">{selectedRegion.location} · {selectedRegion.code}</p></div>
          <MapPinned className="text-primary" size={24} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-background rounded-lg p-3 flex items-center gap-2"><Server size={16} className="text-primary" /><span className="text-xs text-text-secondary">{selectedRegion.deployedServices.length} servicios desplegados</span></div>
          <div className="bg-background rounded-lg p-3 flex items-center gap-2"><ShieldCheck size={16} className="text-security" /><span className="text-xs text-text-secondary">Estado: {selectedRegion.status === "success" ? "Operativo" : selectedRegion.status === "warning" ? "Revisión" : "Incidente"}</span></div>
          <div className="bg-background rounded-lg p-3 flex items-center gap-2"><Activity size={16} className="text-cost" /><span className="text-xs text-text-secondary">{selectedRegion.azCount ?? 0} zonas de disponibilidad</span></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
          <div className="bg-background rounded-lg p-3"><p className="text-text-secondary">Latencia estimada</p><p className="font-semibold text-text-primary mt-1">{selectedRegion.latencyMs} ms desde el punto de referencia</p></div>
          <div className="bg-background rounded-lg p-3"><p className="text-text-secondary">Capacidad</p><p className="font-semibold text-text-primary mt-1">{selectedRegion.capacityNote ?? "Capacidad general disponible"}</p></div>
          <div className="bg-background rounded-lg p-3"><p className="text-text-secondary">Cumplimiento</p><p className="font-semibold text-text-primary mt-1">{selectedRegion.compliance?.join(" · ") ?? "Información pendiente"}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map((region) => (
          <div
            key={region.id}
            onClick={() => setSelectedRegionId(region.id)}
            className={`rounded-card transition-all cursor-pointer ${
              selectedRegionId === region.id ? "ring-2 ring-primary" : ""
            }`}
          >
            <RegionCard region={region} />
          </div>
        ))}
      </div>
    </div>
  );
}