import { MapPinned, ShieldCheck, Users, LockKeyhole, Activity } from "lucide-react";
import Header from "../components/layout/Header";
import SecurityCard from "../components/ui/SecurityCard";
import StatusBadge from "../components/ui/StatusBadge";
import { useCloudData } from "../context/CloudDataContext";
import { regions } from "../data/regions";
import { iamRoles, sharedResponsibility } from "../data/security";
import { inputClasses } from "../utils/formStyles";

const SECURITY_BY_REGION: Record<string, { score: number; alerts: number; compliance: string; status: "success" | "warning" | "danger"; posture: string }> = {
  "us-east-1": { score: 96, alerts: 2, compliance: "SOC · PCI DSS · HIPAA", status: "success", posture: "Base sólida bajo control" },
  "us-west-2": { score: 94, alerts: 3, compliance: "SOC · PCI DSS", status: "success", posture: "Muy buena postura operativa" },
  "sa-east-1": { score: 88, alerts: 5, compliance: "SOC · PCI DSS", status: "warning", posture: "Requiere revisión puntual" },
  "eu-west-1": { score: 92, alerts: 4, compliance: "SOC · PCI DSS · GDPR", status: "success", posture: "Cumplimiento europeo fuerte" },
  "ap-southeast-1": { score: 80, alerts: 7, compliance: "SOC · PCI DSS", status: "danger", posture: "Se necesita reforzar controles" },
  "ap-northeast-1": { score: 95, alerts: 2, compliance: "SOC · PCI DSS", status: "success", posture: "Operación robusta" },
  "ca-central-1": { score: 91, alerts: 3, compliance: "SOC · PCI DSS · HIPAA", status: "success", posture: "Muy bien alineado" },
  "eu-central-1": { score: 93, alerts: 3, compliance: "SOC · PCI DSS · GDPR", status: "success", posture: "Excelente postura regulatoria" },
};

export default function Security() {
  const { selectedRegionId, setSelectedRegionId } = useCloudData();
  const selectedRegion = regions.find((region) => region.id === selectedRegionId) ?? regions[0];
  const regionProfile = SECURITY_BY_REGION[selectedRegion.id] ?? SECURITY_BY_REGION[regions[0].id];

  const regionIndicators = [
    { id: "compliance", title: "Cumplimiento", description: `${regionProfile.compliance} en la región actual`, status: regionProfile.status as "success" | "warning" | "danger" },
    { id: "iam", title: "IAM y permisos", description: "Políticas con privilegio mínimo y accesos controlados", status: "success" as const },
    { id: "encryption", title: "Cifrado", description: "Protección de datos en tránsito y en reposo", status: (regionProfile.score >= 90 ? "success" : "warning") as "success" | "warning" },
    { id: "monitoring", title: "Monitoreo", description: "Alertas y control de cambios con revisión periódica", status: (regionProfile.alerts <= 3 ? "success" : "warning") as "success" | "warning" },
  ];

  return (
    <div>
      <Header
        title="Seguridad"
        subtitle="Responsabilidad compartida, IAM, protección de datos y cumplimiento"
      />

      <div className="bg-card border border-border rounded-card shadow-card p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">Región de enfoque</p>
          <p className="text-xs text-text-secondary mt-0.5">La seguridad se refleja según la región activa del contexto global.</p>
        </div>
        <select className={`${inputClasses} sm:max-w-xs`} value={selectedRegion.id} onChange={(event) => setSelectedRegionId(event.target.value)}>
          {regions.map((region) => <option key={region.id} value={region.id}>{region.code} · {region.name}</option>)}
        </select>
      </div>

      <div className="bg-card border border-primary/20 rounded-card shadow-card p-5 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-primary font-semibold">Seguridad de región</p>
            <h2 className="text-xl font-bold text-text-primary mt-1">{selectedRegion.name}</h2>
            <p className="text-sm text-text-secondary mt-1">{selectedRegion.location} · {selectedRegion.code}</p>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary" size={22} />
            <StatusBadge status={regionProfile.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-background p-3">
            <p className="text-[10px] uppercase tracking-wide text-text-secondary">Puntuación</p>
            <p className="text-2xl font-bold text-text-primary mt-2">{regionProfile.score}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-3">
            <p className="text-[10px] uppercase tracking-wide text-text-secondary">Alertas</p>
            <p className="text-2xl font-bold text-text-primary mt-2">{regionProfile.alerts}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-3">
            <p className="text-[10px] uppercase tracking-wide text-text-secondary">Postura</p>
            <p className="text-sm font-semibold text-text-primary mt-2">{regionProfile.posture}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {regionIndicators.map((indicator) => (
          <SecurityCard key={indicator.id} indicator={indicator} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-card shadow-card p-5">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Modelo de responsabilidad compartida</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-primary uppercase mb-2">AWS administra</p>
              <ul className="space-y-1.5">
                {sharedResponsibility.aws.map((item) => (
                  <li key={item} className="text-xs text-text-secondary flex gap-1.5">
                    <span className="text-primary">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-security uppercase mb-2">Cliente administra</p>
              <ul className="space-y-1.5">
                {sharedResponsibility.customer.map((item) => (
                  <li key={item} className="text-xs text-text-secondary flex gap-1.5">
                    <span className="text-security">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-card shadow-card p-5">
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" /> IAM — Roles y permisos
          </h2>
          <div className="space-y-2">
            {iamRoles.map((role) => (
              <div key={role.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-text-primary">{role.name}</p>
                  <p className="text-xs text-text-secondary flex items-center gap-1">
                    <Users size={12} /> {role.users} usuario(s) · {role.permissions}
                  </p>
                </div>
                <StatusBadge status={role.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-card shadow-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><MapPinned size={18} /></div>
          <div><p className="text-xs text-text-secondary">Región activa</p><p className="text-sm font-bold text-text-primary">{selectedRegion.name}</p></div>
        </div>
        <div className="bg-card border border-border rounded-card shadow-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-security/10 text-security flex items-center justify-center"><LockKeyhole size={18} /></div>
          <div><p className="text-xs text-text-secondary">Cumplimiento</p><p className="text-sm font-bold text-text-primary">{regionProfile.compliance}</p></div>
        </div>
        <div className="bg-card border border-border rounded-card shadow-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cost/10 text-cost flex items-center justify-center"><Activity size={18} /></div>
          <div><p className="text-xs text-text-secondary">Atención</p><p className="text-sm font-bold text-text-primary">{regionProfile.alerts} alertas</p></div>
        </div>
      </div>
    </div>
  );
}