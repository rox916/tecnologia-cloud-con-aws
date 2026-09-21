import { ShieldCheck, Users } from "lucide-react";
import Header from "../components/layout/Header";
import SecurityCard from "../components/ui/SecurityCard";
import StatusBadge from "../components/ui/StatusBadge";
import { securityIndicators, iamRoles, sharedResponsibility } from "../data/security";

export default function Security() {
  return (
    <div>
      <Header
        title="Seguridad"
        subtitle="Responsabilidad compartida, IAM, protección de datos y cumplimiento"
      />

      {/* Indicadores generales: verde/amarillo/rojo vía StatusBadge (Fase 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {securityIndicators.map((indicator) => (
          <SecurityCard key={indicator.id} indicator={indicator} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modelo de responsabilidad compartida */}
        <div className="bg-card border border-border rounded-card shadow-card p-5">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Modelo de Responsabilidad Compartida
          </h2>
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

        {/* IAM: roles y permisos */}
        <div className="bg-card border border-border rounded-card shadow-card p-5">
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" /> IAM — Roles y Permisos
          </h2>
          <div className="space-y-2">
            {iamRoles.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
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
    </div>
  );
}