import { MapPin } from "lucide-react";
import type { Region } from "../../types/cloud";
import { formatCurrency } from "../../utils/format";
import StatusBadge from "./StatusBadge";

interface RegionCardProps {
  region: Region;
  proposalCount?: number;
  monthlyCost?: number;
}

export default function RegionCard({ region, proposalCount = 0, monthlyCost = 0 }: RegionCardProps) {
  return (
    <div className="bg-card border border-border rounded-card shadow-card p-5">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{region.name}</h3>
          <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
            <MapPin size={12} /> {region.location} · {region.code}
          </p>
        </div>
        <StatusBadge status={region.status} />
      </div>

      <div className="mt-3">
        {region.azCount !== undefined && (
          <p className="text-xs text-text-secondary mb-2">{region.azCount} zonas de disponibilidad</p>
        )}

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded-lg bg-background border border-border p-2.5">
            <p className="text-[10px] uppercase tracking-wide text-text-secondary">Propuestas</p>
            <p className="text-sm font-semibold text-text-primary mt-1">{proposalCount}</p>
          </div>
          <div className="rounded-lg bg-cost/5 border border-cost/20 p-2.5">
            <p className="text-[10px] uppercase tracking-wide text-text-secondary">Costo mensual</p>
            <p className="text-sm font-semibold text-cost mt-1">{formatCurrency(monthlyCost)}</p>
          </div>
        </div>

        <p className="text-xs font-medium text-text-secondary mb-1.5">Servicios desplegados</p>
        {region.deployedServices.length === 0 ? (
          <p className="text-xs text-text-secondary italic">Sin despliegues activos</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {region.deployedServices.map((service) => (
              <span
                key={service}
                className="text-xs px-2 py-0.5 rounded-md bg-background border border-border text-text-secondary"
              >
                {service}
              </span>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border">
          <div><p className="text-[11px] text-text-secondary">Latencia estimada</p><p className="text-xs font-semibold text-text-primary">{region.latencyMs ?? "-"} ms</p></div>
          <div><p className="text-[11px] text-text-secondary">Cumplimiento</p><p className="text-xs font-semibold text-text-primary">{region.compliance?.slice(0, 2).join(" · ") ?? "Información pendiente"}</p></div>
        </div>
        <p className="text-xs text-text-secondary mt-3">{region.recommendedFor ?? "Región disponible para cargas generales"}</p>
      </div>
    </div>
  );
}