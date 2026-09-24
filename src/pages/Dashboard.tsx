import { DollarSign, Server, ShieldCheck, Layers, Globe, Activity, ArrowRight, CheckCircle2, AlertTriangle, Network, MapPinned, Calculator, ClipboardList } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import StatCard from "../components/ui/StatCard";
import SecurityCard from "../components/ui/SecurityCard";
import SecurityScoreRing from "../components/ui/SecurityScoreRing";
import ChartCard from "../components/ui/ChartCard";
import ActivityFeed from "../components/ui/ActivityFeed";
import { securityIndicators } from "../data/security";
import { useCloudData } from "../context/CloudDataContext";
import { regions } from "../data/regions";
import { awsServices } from "../data/awsServices";
import { networkNodes } from "../data/network";
import { formatCurrency } from "../utils/format";

export default function Dashboard() {
  const { proposals, costEstimates, activityLog, selectedRegionId } = useCloudData();

  const monthlyCost = costEstimates.reduce((sum, e) => sum + e.monthlyCost, 0);
  const annualCost = monthlyCost * 12;

  const servicesUsed = new Set([
    ...costEstimates.map((estimate) => estimate.serviceId),
    ...(proposals[0]?.selectedServices ?? []),
  ]).size;
  const selectedRegion = regions.find((region) => region.id === selectedRegionId);
  const cloudResources = costEstimates.reduce((sum, estimate) => sum + estimate.quantity, 0);

  const securityScore = Math.round(
    (securityIndicators.filter((i) => i.status === "success").length / securityIndicators.length) * 100
  );
  const healthyRegions = regions.filter((region) => region.status === "success").length;
  const warningRegions = regions.filter((region) => region.status !== "success").length;
  const activeServices = awsServices.filter((service) => service.status === "active").length;
  const warningIndicators = securityIndicators.filter((indicator) => indicator.status !== "success").length;
  const latestProposal = proposals[0];
  const dashboardLinks = [
    { href: "/costs", label: "Costos", detail: costEstimates.length > 0 ? `${formatCurrency(monthlyCost)} proyectados al mes` : "Crea tu primera estimación", icon: Calculator, color: "text-cost bg-cost/10" },
    { href: "/services", label: "Servicios AWS", detail: `${awsServices.length} servicios en el catálogo`, icon: Layers, color: "text-primary bg-primary/10" },
    { href: "/infrastructure", label: "Infraestructura", detail: `${healthyRegions} regiones operativas · ${warningRegions} en revisión`, icon: MapPinned, color: "text-security bg-security/10" },
    { href: "/planning", label: "Planificación", detail: latestProposal ? `Última: ${latestProposal.solutionName}` : "Diseña una solución cloud", icon: ClipboardList, color: "text-primary bg-primary/10" },
  ];

  const groupedCosts = costEstimates.reduce<Record<string, number>>((groups, estimate) => ({ ...groups, [estimate.serviceName]: (groups[estimate.serviceName] ?? 0) + estimate.monthlyCost }), {});
  const costChartData = {
    labels: Object.keys(groupedCosts),
    datasets: [
      {
        label: "Costo mensual (USD)",
        data: Object.values(groupedCosts),
        backgroundColor: "#2563EB",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div>
      <Header title="Dashboard" subtitle="Resumen general de la solución Cloud" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Servicios utilizados" value={servicesUsed} icon={Layers} accentColor="primary" />
        <StatCard label="Región seleccionada" value={selectedRegion ? selectedRegion.code : "Sin seleccionar"} subtitle={selectedRegion?.name} icon={Globe} accentColor="primary" />
        <StatCard label="Costo mensual" value={`$${monthlyCost.toFixed(2)}`} icon={DollarSign} accentColor="cost" />
        <StatCard label="Costo anual" value={`$${annualCost.toFixed(2)}`} icon={DollarSign} accentColor="cost" />
        <StatCard label="Propuestas registradas" value={proposals.length} icon={Server} accentColor="primary" />
        <StatCard label="Recursos Cloud" value={cloudResources} icon={Server} accentColor="primary" />
        <StatCard
          label="Estado de seguridad"
          value={securityScore >= 80 ? "Correcto" : "Revisar"}
          icon={ShieldCheck}
          accentColor="security"
        />
        <StatCard
          label="Estado de arquitectura"
          value={proposals.length > 0 ? "Configurada" : "Pendiente"}
          icon={Activity}
          accentColor="cost"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Costos por servicio (datos reales registrados)">
            {costEstimates.length === 0 ? (
              <p className="text-sm text-text-secondary">
                Aún no hay estimaciones. Ve a "Costos" para registrar una y verla aquí.
              </p>
            ) : (
              <Bar data={costChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            )}
          </ChartCard>
        </div>

        <div>
          <div className="bg-card border border-border rounded-card shadow-card p-5 mb-4">
            <SecurityScoreRing score={securityScore} />
          </div>
          <div className="space-y-3 mb-6">
            {securityIndicators.slice(0, 2).map((indicator) => (
              <SecurityCard key={indicator.id} indicator={indicator} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div><h2 className="text-lg font-semibold text-text-primary">Vista general de módulos</h2><p className="text-xs text-text-secondary mt-0.5">Accede rápidamente al estado y las acciones principales de cada área.</p></div>
          <Link to="/services" className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Ver catálogo <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {dashboardLinks.map(({ href, label, detail, icon: Icon, color }) => (
            <Link key={href} to={href} className="group bg-card border border-border rounded-card shadow-card p-4 transition-all hover:-translate-y-1 hover:border-primary/40">
              <div className="flex items-start justify-between gap-3"><div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}><Icon size={19} /></div><ArrowRight size={16} className="text-text-secondary transition-transform group-hover:translate-x-1" /></div>
              <p className="text-sm font-semibold text-text-primary mt-3">{label}</p><p className="text-xs text-text-secondary mt-1 leading-relaxed">{detail}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-card border border-border rounded-card shadow-card p-5">
          <div className="flex items-center justify-between mb-4"><h2 className="text-base font-semibold text-text-primary">Salud de regiones</h2><Link to="/infrastructure" className="text-xs text-primary hover:underline">Abrir</Link></div>
          <div className="flex items-center gap-4 mb-4"><div className="text-3xl font-bold text-text-primary">{healthyRegions}<span className="text-sm font-normal text-text-secondary">/{regions.length}</span></div><div><p className="text-xs text-text-secondary">operativas</p><p className="text-xs text-text-secondary">{warningRegions} requieren revisión</p></div></div>
          <div className="space-y-2">{regions.slice(0, 4).map((region) => <div key={region.id} className="flex items-center justify-between text-xs"><span className="text-text-primary">{region.code}</span><span className={`inline-flex items-center gap-1 ${region.status === "success" ? "text-security" : "text-alert"}`}>{region.status === "success" ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}{region.status === "success" ? "Operativa" : "Revisión"}</span></div>)}</div>
        </div>

        <div className="bg-card border border-border rounded-card shadow-card p-5">
          <div className="flex items-center justify-between mb-4"><h2 className="text-base font-semibold text-text-primary">Seguridad y red</h2><Link to="/security" className="text-xs text-primary hover:underline">Ver seguridad</Link></div>
          <div className="space-y-3"><div className="flex items-center justify-between"><span className="text-xs text-text-secondary">Indicadores correctos</span><span className="text-sm font-bold text-security">{securityScore}%</span></div><div className="h-2 bg-background rounded-full overflow-hidden"><div className="h-full bg-security rounded-full" style={{ width: `${securityScore}%` }} /></div><div className="flex items-center justify-between text-xs"><span className="text-text-secondary">Pendientes de revisión</span><span className={warningIndicators > 0 ? "text-alert font-semibold" : "text-security font-semibold"}>{warningIndicators}</span></div><div className="pt-3 border-t border-border flex items-center gap-2"><Network size={16} className="text-primary" /><div><p className="text-xs font-medium text-text-primary">{networkNodes.length} nodos conectados</p><Link to="/network" className="text-[11px] text-primary hover:underline">Explorar arquitectura de red</Link></div></div></div>
        </div>

        <div className="bg-card border border-border rounded-card shadow-card p-5">
          <div className="flex items-center justify-between mb-4"><h2 className="text-base font-semibold text-text-primary">Inventario cloud</h2><Link to="/services" className="text-xs text-primary hover:underline">Explorar</Link></div>
          <div className="grid grid-cols-2 gap-3"><div className="bg-background rounded-lg p-3"><p className="text-xs text-text-secondary">Servicios activos</p><p className="text-xl font-bold text-text-primary mt-1">{activeServices}</p></div><div className="bg-background rounded-lg p-3"><p className="text-xs text-text-secondary">Región de trabajo</p><p className="text-sm font-bold text-text-primary mt-2">{selectedRegion?.code ?? "-"}</p></div><div className="bg-background rounded-lg p-3"><p className="text-xs text-text-secondary">Recursos estimados</p><p className="text-xl font-bold text-text-primary mt-1">{cloudResources}</p></div><div className="bg-background rounded-lg p-3"><p className="text-xs text-text-secondary">Propuestas</p><p className="text-xl font-bold text-text-primary mt-1">{proposals.length}</p></div></div>
        </div>
      </div>

      <div className="mt-6 bg-card border border-border rounded-card shadow-card p-5">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Actividad reciente</h2>
        <ActivityFeed entries={activityLog} />
      </div>
    </div>
  );
}