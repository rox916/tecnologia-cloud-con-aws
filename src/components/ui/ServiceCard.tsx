import { Server, Database, HardDrive, ShieldCheck, Network } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AwsService, ServiceCategory } from "../../types/cloud";
import StatusBadge from "./StatusBadge";

interface ServiceCardProps {
  service: AwsService;
}

// Icono y color por categoría, centralizados aquí — si se agrega una
// categoría nueva al enunciado, solo se toca este mapeo.
const CATEGORY_CONFIG: Record<ServiceCategory, { icon: LucideIcon; color: string }> = {
  Compute: { icon: Server, color: "text-primary bg-primary/10" },
  Storage: { icon: HardDrive, color: "text-cost bg-cost/10" },
  Database: { icon: Database, color: "text-primary bg-primary/10" },
  Security: { icon: ShieldCheck, color: "text-security bg-security/10" },
  Networking: { icon: Network, color: "text-text-secondary bg-background" },
};

// Mapea el status del dominio (active/available/inactive) al StatusLevel
// visual (success/warning/danger) que ya entiende StatusBadge.
const STATUS_MAP: Record<AwsService["status"], { level: "success" | "warning" | "danger"; label: string }> = {
  active: { level: "success", label: "Activo" },
  available: { level: "warning", label: "Disponible" },
  inactive: { level: "danger", label: "Inactivo" },
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const { icon: Icon, color } = CATEGORY_CONFIG[service.category];
  const status = STATUS_MAP[service.status];

  return (
    <div className="bg-card border border-border rounded-card shadow-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        <StatusBadge status={status.level} label={status.label} />
      </div>

      <h3 className="text-base font-semibold text-text-primary">{service.name}</h3>
      <span className="text-xs text-text-secondary">{service.category}</span>

      <p className="text-sm text-text-secondary mt-2 leading-relaxed">
        {service.description}
      </p>

      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs font-medium text-text-secondary">Función principal</p>
        <p className="text-xs text-text-primary mt-0.5">{service.mainFunction}</p>
      </div>
    </div>
  );
}