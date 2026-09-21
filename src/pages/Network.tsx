import { useState } from "react";
import { Database, Globe, LockKeyhole, Network as NetworkIcon, Radio, Route, Server, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Header from "../components/layout/Header";
import NetworkNodeBox from "../components/ui/NetworkNodeBox";
import Arrow from "../components/ui/Arrow";
import { networkNodes } from "../data/network";

// Mapeo de id → icono. Se mantiene separado del array de datos (network.ts)
// porque los iconos son un detalle de presentación, no un dato del dominio.
const NODE_ICONS: Record<string, LucideIcon> = {
  internet: Globe,
  route53: Route,
  cloudfront: Radio,
  vpc: NetworkIcon,
  compute: Server,
};

export default function Network() {
  const [selectedId, setSelectedId] = useState(networkNodes[0].id);
  const selectedNode = networkNodes.find((n) => n.id === selectedId)!;

  return (
    <div>
      <Header
        title="Arquitectura de Red"
        subtitle="Diseña y consulta el recorrido del tráfico hasta los recursos privados"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-card shadow-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Globe size={19} /></div>
          <div><p className="text-xs text-text-secondary">Entrada pública</p><p className="text-sm font-bold text-text-primary">DNS + CDN</p></div>
        </div>
        <div className="bg-card border border-border rounded-card shadow-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-security/10 text-security flex items-center justify-center"><ShieldCheck size={19} /></div>
          <div><p className="text-xs text-text-secondary">Capa de protección</p><p className="text-sm font-bold text-text-primary">VPC aislada</p></div>
        </div>
        <div className="bg-card border border-border rounded-card shadow-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cost/10 text-cost flex items-center justify-center"><Server size={19} /></div>
          <div><p className="text-xs text-text-secondary">Recursos internos</p><p className="text-sm font-bold text-text-primary">EC2 + RDS</p></div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-card shadow-card p-5 sm:p-6 mb-6 overflow-x-auto">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div><p className="text-sm font-semibold text-text-primary">Flujo de solicitud</p><p className="text-xs text-text-secondary mt-0.5">Selecciona un nodo para consultar su función.</p></div>
          <span className="text-xs font-medium text-security bg-security/10 px-2.5 py-1 rounded-full shrink-0">Arquitectura activa</span>
        </div>
        <div className="flex items-center gap-1 min-w-max mx-auto w-fit">
          {networkNodes.map((node, index) => (
            <div key={node.id} className="flex items-center gap-1">
              <NetworkNodeBox
                label={node.label}
                icon={NODE_ICONS[node.id]}
                isActive={selectedId === node.id}
                onClick={() => setSelectedId(node.id)}
              />
              {index < networkNodes.length - 1 && <Arrow />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-primary/20 rounded-card shadow-card p-5 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div><p className="text-xs uppercase tracking-wide font-semibold text-primary">Red privada virtual</p><h2 className="text-lg font-bold text-text-primary mt-1">VPC de producción</h2><p className="text-xs text-text-secondary mt-1">Los recursos internos no quedan expuestos directamente a Internet.</p></div>
          <NetworkIcon className="text-primary" size={23} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-background p-4"><div className="flex items-center gap-2 text-primary mb-2"><NetworkIcon size={16} /><span className="text-xs font-semibold">Subred pública</span></div><p className="text-xs text-text-secondary">Entrada controlada desde CloudFront mediante reglas de red.</p></div>
          <div className="rounded-xl border border-border bg-background p-4"><div className="flex items-center gap-2 text-security mb-2"><Server size={16} /><span className="text-xs font-semibold">Capa de aplicación</span></div><p className="text-xs text-text-secondary">EC2 procesa solicitudes y escala según la demanda.</p></div>
          <div className="rounded-xl border border-border bg-background p-4"><div className="flex items-center gap-2 text-cost mb-2"><Database size={16} /><span className="text-xs font-semibold">Subred privada</span></div><p className="text-xs text-text-secondary">RDS almacena datos sin acceso público directo.</p></div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-text-secondary"><LockKeyhole size={14} className="text-security" /> Security Groups y rutas privadas protegen la comunicación interna.</div>
      </div>

      <div className="bg-card border border-border rounded-card shadow-card p-5">
        <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-primary" /><p className="text-xs uppercase tracking-wide font-semibold text-primary">Nodo seleccionado</p></div>
        <h2 className="text-base font-semibold text-text-primary mb-1.5">{selectedNode.label}</h2>
        <p className="text-sm text-text-secondary leading-relaxed">{selectedNode.description}</p>
      </div>
    </div>
  );
} 