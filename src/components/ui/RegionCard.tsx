import { MapPin } from "lucide-react";
import type { Region } from "../../types/cloud";
import StatusBadge from "./StatusBadge";

interface RegionCardProps {
  region: Region;
}

export default function RegionCard({ region }: RegionCardProps) {
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
      </div>
    </div>
  );
}