import { DollarSign, Server, ShieldCheck, Layers, Globe, Activity } from "lucide-react";
import { Bar } from "react-chartjs-2";
import Header from "../components/layout/Header";
import StatCard from "../components/ui/StatCard";
import SecurityCard from "../components/ui/SecurityCard";
import SecurityScoreRing from "../components/ui/SecurityScoreRing";
import ChartCard from "../components/ui/ChartCard";
import ActivityFeed from "../components/ui/ActivityFeed";
import { securityIndicators } from "../data/security";
import { useCloudData } from "../context/CloudDataContext";
import { regions } from "../data/regions";

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

      <div className="mt-6 bg-card border border-border rounded-card shadow-card p-5">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Actividad reciente</h2>
        <ActivityFeed entries={activityLog} />
      </div>
    </div>
  );
}