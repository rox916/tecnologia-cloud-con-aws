import { useMemo, useState } from "react";
import { Database, Globe, LockKeyhole, Network as NetworkIcon, Radio, Route, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Header from "../components/layout/Header";
import NetworkNodeBox from "../components/ui/NetworkNodeBox";
import Arrow from "../components/ui/Arrow";
import { useCloudData } from "../context/CloudDataContext";
import { regions } from "../data/regions";
import { networkNodes } from "../data/network";
import { inputClasses } from "../utils/formStyles";

const NODE_ICONS: Record<string, LucideIcon> = {
  internet: Globe,
  route53: Route,
  cloudfront: Radio,
  vpc: NetworkIcon,
  compute: Server,
};

const REGIONAL_NETWORK_PROFILES: Record<string, { latency: number; throughput: string; entryPoint: string; routing: string; status: "success" | "warning" | "danger" }> = {
  "us-east-1": { latency: 42, throughput: "2.4 Gbps", entryPoint: "Route 53 + CloudFront", routing: "Flujo regional directo con baja latencia", status: "success" },
  "us-west-2": { latency: 58, throughput: "1.9 Gbps", entryPoint: "CloudFront edge + DNS", routing: "Rutas altamente balanceadas", status: "success" },
  "sa-east-1": { latency: 76, throughput: "1.2 Gbps", entryPoint: "Route 53 regional", routing: "Enrutamiento capaz pero con mayor latencia", status: "warning" },
  "eu-west-1": { latency: 112, throughput: "2.1 Gbps", entryPoint: "Edge + DNS europeo", routing: "Conexión muy estable para Europa", status: "success" },
  "ap-southeast-1": { latency: 189, throughput: "0.9 Gbps", entryPoint: "Distribución limitada", routing: "Más sensible a cuellos de botella", status: "danger" },
  "ap-northeast-1": { latency: 214, throughput: "1.8 Gbps", entryPoint: "Edge japonés + CDN", routing: "Rutas convergentes y robustas", status: "success" },
  "ca-central-1": { latency: 69, throughput: "1.6 Gbps", entryPoint: "Route 53 + CloudFront", routing: "Conectividad regional equilibrada", status: "success" },
  "eu-central-1": { latency: 124, throughput: "1.7 Gbps", entryPoint: "DNS + CDN europeo", routing: "Rutas europeas equilibradas", status: "success" },
};

export default function Network() {
  const { selectedRegionId, setSelectedRegionId } = useCloudData();
  const [selectedId, setSelectedId] = useState(networkNodes[0].id);
  const selectedRegion = regions.find((region) => region.id === selectedRegionId) ?? regions[0];
  const selectedNode = networkNodes.find((n) => n.id === selectedId)!;
  const regionProfile = REGIONAL_NETWORK_PROFILES[selectedRegion.id] ?? REGIONAL_NETWORK_PROFILES[regions[0].id];

  const summaryStats = useMemo(() => [
    { label: "Entrada pública", value: regionProfile.entryPoint, icon: Globe, tone: "text-primary bg-primary/10" },
    { label: "Latencia", value: `${regionProfile.latency} ms`, icon: Radio, tone: "text-security bg-security/10" },
    { label: "Throughput", value: regionProfile.throughput, icon: Server, tone: "text-cost bg-cost/10" },
  ], [regionProfile]);

  return (
    <div>
      <Header
        title="Arquitectura de Red"
        subtitle="Diseña y consulta el recorrido del tráfico hasta los recursos privados"
      />

      <div className="bg-card border border-border rounded-card shadow-card p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">Región de red</p>
          <p className="text-xs text-text-secondary mt-0.5">La arquitectura y el tráfico se reflejan según la región activa del contexto global.</p>
        </div>
        <select className={`${inputClasses} sm:max-w-xs`} value={selectedRegion.id} onChange={(event) => setSelectedRegionId(event.target.value)}>
          {regions.map((region) => <option key={region.id} value={region.id}>{region.code} · {region.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {summaryStats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="bg-card border border-border rounded-card shadow-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tone}`}><Icon size={19} /></div>
            <div>
              <p className="text-xs text-text-secondary">{label}</p>
              <p className="text-sm font-bold text-text-primary">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-card shadow-card p-5 sm:p-6 mb-6 overflow-x-auto">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-sm font-semibold text-text-primary">Flujo de solicitud</p>
            <p className="text-xs text-text-secondary mt-0.5">Selecciona un nodo para consultar su función en {selectedRegion.name}.</p>
          </div>
          <span className="text-xs font-medium text-security bg-security/10 px-2.5 py-1 rounded-full shrink-0">{regionProfile.routing}</span>
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
          <div>
            <p className="text-xs uppercase tracking-wide font-semibold text-primary">Red privada virtual</p>
            <h2 className="text-lg font-bold text-text-primary mt-1">VPC de {selectedRegion.name}</h2>
            <p className="text-xs text-text-secondary mt-1">Los recursos internos no quedan expuestos directamente a Internet y se conectan mediante flujo regional controlado.</p>
          </div>
          <NetworkIcon className="text-primary" size={23} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-primary mb-2"><NetworkIcon size={16} /><span className="text-xs font-semibold">Subred pública</span></div>
            <p className="text-xs text-text-secondary">Entrada controlada desde {regionProfile.entryPoint.split(" + ")[0]} con reglas y balanceo regional.</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-security mb-2"><Server size={16} /><span className="text-xs font-semibold">Capa de aplicación</span></div>
            <p className="text-xs text-text-secondary">EC2 procesa la lógica y se escalan burbujas de tráfico según demanda y latencia.</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-cost mb-2"><Database size={16} /><span className="text-xs font-semibold">Subred privada</span></div>
            <p className="text-xs text-text-secondary">RDS y servicios internos quedan aislados con acceso restringido y seguridad de borde.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-text-secondary"><LockKeyhole size={14} className="text-security" /> Security Groups y rutas privadas protegen la comunicación interna en la región activa.</div>
      </div>

      <div className="bg-card border border-border rounded-card shadow-card p-5">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <p className="text-xs uppercase tracking-wide font-semibold text-primary">Nodo seleccionado</p>
          </div>
          <span className="text-[11px] font-medium text-text-secondary">{selectedRegion.code}</span>
        </div>
        <h2 className="text-base font-semibold text-text-primary mb-1.5">{selectedNode.label}</h2>
        <p className="text-sm text-text-secondary leading-relaxed">{selectedNode.description}</p>
      </div>
    </div>
  );
}