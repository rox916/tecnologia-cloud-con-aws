// src/pages/Infrastructure.tsx
import { Activity, Database, Globe2, MapPinned, RadioTower, Server, ShieldCheck } from "lucide-react";
import Header from "../components/layout/Header";
import RegionCard from "../components/ui/RegionCard";
import WorldMap from "../components/ui/WorldMap";
import { regions } from "../data/regions";
import { availabilityZones, dataCenters, edgeLocations } from "../data/infrastructure";
import { useCloudData } from "../context/CloudDataContext";
import { inputClasses } from "../utils/formStyles";

export default function Infrastructure() {
  const { selectedRegionId, setSelectedRegionId } = useCloudData();
  const selectedRegion = regions.find((region) => region.id === selectedRegionId) ?? regions[0];
  const selectedAvailabilityZones = availabilityZones.filter((zone) => zone.regionId === selectedRegion.id);
  const selectedDataCenters = dataCenters.filter((center) => center.regionId === selectedRegion.id);
  const selectedEdgeLocations = edgeLocations.filter((edge) => edge.regionId === selectedRegion.id);

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
          availabilityZones={availabilityZones}
          dataCenters={dataCenters}
          edgeLocations={edgeLocations}
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

      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div><h2 className="text-lg font-semibold text-text-primary">Capas de infraestructura</h2><p className="text-xs text-text-secondary mt-0.5">Detalle físico y de distribución de {selectedRegion.name}.</p></div>
          <span className="text-xs text-text-secondary">{selectedRegion.code}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-card shadow-card p-4">
            <div className="flex items-center gap-2 text-primary"><Globe2 size={18} /><h3 className="text-sm font-semibold">Zonas de disponibilidad</h3></div>
            <p className="text-2xl font-bold text-text-primary mt-3">{selectedAvailabilityZones.length}</p>
            <p className="text-xs text-text-secondary mt-1">Dominios aislados para alta disponibilidad</p>
          </div>
          <div className="bg-card border border-border rounded-card shadow-card p-4">
            <div className="flex items-center gap-2 text-security"><Database size={18} /><h3 className="text-sm font-semibold">Centros de datos</h3></div>
            <p className="text-2xl font-bold text-text-primary mt-3">{selectedDataCenters.length}</p>
            <p className="text-xs text-text-secondary mt-1">Instalaciones que alojan la infraestructura física</p>
          </div>
          <div className="bg-card border border-border rounded-card shadow-card p-4">
            <div className="flex items-center gap-2 text-cost"><RadioTower size={18} /><h3 className="text-sm font-semibold">Ubicaciones de borde</h3></div>
            <p className="text-2xl font-bold text-text-primary mt-3">{selectedEdgeLocations.length}</p>
            <p className="text-xs text-text-secondary mt-1">Puntos cercanos para entregar contenido</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="bg-card border border-border rounded-card shadow-card p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Zonas de disponibilidad</h3>
            <div className="space-y-2">{selectedAvailabilityZones.map((zone) => <div key={zone.id} className="flex items-center justify-between gap-3 text-xs"><span className="text-text-primary">{zone.code}</span><span className="text-text-secondary">{zone.dataCenterCount} centros · {zone.status === "success" ? "Operativa" : zone.status === "warning" ? "Revisión" : "Incidente"}</span></div>)}</div>
          </div>
          <div className="bg-card border border-border rounded-card shadow-card p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Centros de datos</h3>
            <div className="space-y-3">{selectedDataCenters.map((center) => <div key={center.id}><div className="flex items-center justify-between gap-2 text-xs"><span className="font-medium text-text-primary">{center.name}</span><span className={center.status === "success" ? "text-security" : center.status === "warning" ? "text-alert" : "text-danger"}>{center.status === "success" ? "Activo" : center.status === "warning" ? "Revisión" : "Alerta"}</span></div><p className="text-[11px] text-text-secondary mt-0.5">{center.city} · {center.purpose}</p></div>)}</div>
          </div>
          <div className="bg-card border border-border rounded-card shadow-card p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Ubicaciones de borde</h3>
            <div className="space-y-3">{selectedEdgeLocations.map((edge) => <div key={edge.id}><p className="text-xs font-medium text-text-primary">{edge.name}</p><p className="text-[11px] text-text-secondary mt-0.5">{edge.city}, {edge.country}</p><div className="flex flex-wrap gap-1 mt-1">{edge.services.map((service) => <span key={service} className="text-[10px] px-1.5 py-0.5 rounded bg-background border border-border text-text-secondary">{service}</span>)}</div></div>)}</div>
          </div>
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