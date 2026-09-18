import { DollarSign, Server, ShieldCheck, Layers, Globe, Activity } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import Header from "../components/layout/Header";
import StatCard from "../components/ui/StatCard";
import SecurityCard from "../components/ui/SecurityCard";
import ChartCard from "../components/ui/ChartCard";
import { dashboardSummary, securityOverview, monthlyCostTrend } from "../data/mockData";

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard() {
    const chartData = {
        labels: monthlyCostTrend.map((m) => m.month),
        datasets: [
            {
                label: "Costo mensual (USD)",
                data: monthlyCostTrend.map((m) => m.cost),
                borderColor: "#2563EB",
                backgroundColor: "rgba(37, 99, 235, 0.1)",
                tension: 0.35,
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                ticks: {
                    // Tipar explicitamente a 'string | number' arregla el TS2322
                    callback: (value: string | number) => `$${value}`,
                },
            },
        },
    };

    return (
        <div>
            <Header title="Dashboard" subtitle="Resumen general de la solución Cloud" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Servicios utilizados" value={dashboardSummary.servicesUsed} icon={Layers} accentColor="primary" />
                <StatCard label="Región seleccionada" value={dashboardSummary.selectedRegion} icon={Globe} accentColor="primary" />
                <StatCard label="Costo mensual" value={`$${dashboardSummary.monthlyCost.toFixed(2)}`} icon={DollarSign} accentColor="cost" />
                <StatCard label="Costo anual" value={`$${dashboardSummary.annualCost.toFixed(2)}`} icon={DollarSign} accentColor="cost" />
                <StatCard label="Recursos Cloud" value={dashboardSummary.cloudResources} icon={Server} accentColor="primary" />
                <StatCard
                    label="Estado de seguridad"
                    value={dashboardSummary.securityStatus === "success" ? "Correcto" : "Revisar"}
                    icon={ShieldCheck}
                    accentColor="security"
                />
                <StatCard
                    label="Estado de arquitectura"
                    value={dashboardSummary.architectureStatus === "success" ? "Óptima" : "Atención"}
                    icon={Activity}
                    accentColor="cost"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartCard title="Tendencia de costo mensual">
                        <Line data={chartData} options={chartOptions} />
                    </ChartCard>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-text-primary mb-3">
                        Estado de seguridad
                    </h2>
                    <div className="space-y-3">
                        {securityOverview.map((indicator) => (
                            <SecurityCard key={indicator.id} indicator={indicator} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}