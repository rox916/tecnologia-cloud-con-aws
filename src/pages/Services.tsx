import { useMemo, useState } from "react";
import { ExternalLink, Search, X } from "lucide-react";
import Header from "../components/layout/Header";
import ServiceCard from "../components/ui/ServiceCard";
import { awsServices } from "../data/awsServices";
import type { ServiceCategory } from "../types/cloud";
import { inputClasses } from "../utils/formStyles";

const categories: Array<"Todas" | ServiceCategory> = ["Todas", "Compute", "Storage", "Database", "Security", "Networking"];

export default function Services() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"Todas" | ServiceCategory>("Todas");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredServices = useMemo(() => awsServices.filter((service) => {
    const matchesQuery = `${service.name} ${service.description} ${service.mainFunction}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === "Todas" || service.category === category);
  }), [query, category]);
  const selectedService = awsServices.find((service) => service.id === selectedId);

  return (
    <div>
      <Header
        title="Servicios AWS"
        subtitle="Catálogo de servicios utilizados en la solución"
      />

      <div className="bg-card border border-border rounded-card shadow-card p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <label className="relative flex-1">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input className={`${inputClasses} pl-10`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, función o descripción..." aria-label="Buscar servicios" />
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`px-3 py-2 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors ${category === item ? "bg-primary text-white border-primary" : "bg-background text-text-secondary border-border hover:border-primary/50"}`}>{item}</button>)}
          </div>
        </div>
        <p className="text-xs text-text-secondary mt-3">{filteredServices.length} servicio(s) encontrado(s)</p>
      </div>

      {selectedService && (
        <div className="bg-card border border-primary/25 rounded-card shadow-card p-5 mb-6 animate-fade-in">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs uppercase tracking-wide text-primary font-semibold">Vista detallada</p><h2 className="text-xl font-bold text-text-primary mt-1">{selectedService.name}</h2><p className="text-xs text-text-secondary mt-1">{selectedService.category}</p></div>
            <button type="button" onClick={() => setSelectedId(null)} aria-label="Cerrar detalle" className="text-text-secondary hover:text-text-primary"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
            <div><p className="text-xs font-semibold text-text-secondary mb-1">Descripción</p><p className="text-text-primary">{selectedService.description}</p></div>
            <div><p className="text-xs font-semibold text-text-secondary mb-1">Rol en la arquitectura</p><p className="text-text-primary">{selectedService.architectureRole}</p></div>
            <div><p className="text-xs font-semibold text-text-secondary mb-1">Modelo de precios</p><p className="text-text-primary">{selectedService.pricingModel}</p></div>
            <div><p className="text-xs font-semibold text-text-secondary mb-1">Función principal</p><p className="text-text-primary">{selectedService.mainFunction}</p></div>
            <div><p className="text-xs font-semibold text-text-secondary mb-1">Casos de uso</p><div className="flex flex-wrap gap-1.5">{selectedService.useCases.map((item) => <span key={item} className="text-xs px-2 py-1 rounded-md bg-primary/5 text-primary border border-primary/10">{item}</span>)}</div></div>
            <div><p className="text-xs font-semibold text-text-secondary mb-1">Capacidades clave</p><ul className="list-disc list-inside text-text-primary">{selectedService.keyFeatures.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
          <a href={selectedService.documentationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mt-5 hover:underline">Abrir documentación oficial <ExternalLink size={14} /></a>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <button type="button" key={service.id} onClick={() => setSelectedId(service.id)} className="text-left rounded-card transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/50">
            <ServiceCard service={service} />
          </button>
        ))}
      </div>
      {filteredServices.length === 0 && <div className="bg-card border border-dashed border-border rounded-card p-10 text-center text-sm text-text-secondary">No hay servicios que coincidan con los filtros.</div>}
    </div>
  );
}