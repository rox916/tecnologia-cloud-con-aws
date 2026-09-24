import { useState, useMemo, type FormEvent } from "react";
import { Bar } from "react-chartjs-2";
import { Calculator, Download, PiggyBank, Plus, RotateCcw, TrendingDown } from "lucide-react";
import Header from "../components/layout/Header";
import FormField from "../components/ui/FormField";
import CostCard from "../components/ui/CostCard";
import ChartCard from "../components/ui/ChartCard";
import { useCloudData } from "../context/CloudDataContext";
import { inputClasses } from "../utils/formStyles";
import { formatCurrency } from "../utils/format";
import { awsServices } from "../data/awsServices";
import { hourlyRates } from "../data/serviceCosts";
import type { CostEstimate } from "../types/cloud";
import { downloadReport } from "../utils/exportReport";

const CHART_COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#DC2626", "#64748B", "#0EA5E9", "#8B5CF6"];

export default function Costs() {
  const [serviceId, setServiceId] = useState(awsServices[0].id);
  const [quantity, setQuantity] = useState(1);
  const [hours, setHours] = useState(730); // horas aprox. en un mes
  const [budget, setBudget] = useState(1000);
  const { costEstimates: estimates, addCostEstimate, removeCostEstimate, clearCostEstimates } = useCloudData();

  const unitCost = hourlyRates[serviceId] ?? 0;
  const previewMonthly = unitCost * quantity * hours;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const service = awsServices.find((s) => s.id === serviceId);
    if (!service) return;

    const monthlyCost = unitCost * quantity * hours;

    const newEstimate: CostEstimate = {
      id: crypto.randomUUID(),
      serviceId,
      serviceName: service.name,
      quantity,
      estimatedHours: hours,
      unitCost,
      monthlyCost,
      annualCost: monthlyCost * 12,
    };

    addCostEstimate(newEstimate);
    setQuantity(1);
  };

  // Totales derivados: se recalculan solo cuando cambian los estimates,
  // no en cada render (evita recalcular innecesariamente).
  const totals = useMemo(() => {
    const monthly = estimates.reduce((sum, e) => sum + e.monthlyCost, 0);
    const annual = monthly * 12;
    const projectedSavings = annual * 0.12;
    return { monthly, annual, projectedSavings, budgetUsed: budget > 0 ? (monthly / budget) * 100 : 0 };
  }, [estimates, budget]);

  const serviceTotals = useMemo(() => {
    const totalsByService = new Map<string, number>();
    estimates.forEach((estimate) => {
      totalsByService.set(estimate.serviceName, (totalsByService.get(estimate.serviceName) ?? 0) + estimate.monthlyCost);
    });
    return [...totalsByService.entries()].sort(([, first], [, second]) => second - first);
  }, [estimates]);

  const chartData = useMemo(
    () => ({
      labels: serviceTotals.map(([name]) => name),
      datasets: [
        {
          label: "Costo mensual",
          data: serviceTotals.map(([, total]) => total),
          backgroundColor: serviceTotals.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    }),
    [serviceTotals]
  );

  const chartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context: { raw: unknown }) => formatCurrency(Number(context.raw)) } },
    },
    scales: {
      x: { beginAtZero: true, ticks: { callback: (value: string | number) => `$${value}` } },
      y: { grid: { display: false } },
    },
  };

  return (
    <div>
      <Header title="Costos y Economía Cloud" subtitle="Modela el consumo mensual y toma decisiones con datos claros" />

      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-card shadow-card p-5 sm:p-6 mb-6"
      >
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-sm font-semibold text-text-primary">Nueva estimación</p>
            <p className="text-xs text-text-secondary mt-0.5">Calcula el consumo antes de añadirlo al escenario.</p>
          </div>
          <Calculator className="text-primary" size={22} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <FormField label="Servicio">
            <select className={inputClasses} value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
              {awsServices.map((service) => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Cantidad">
            <input type="number" min={1} className={inputClasses} value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} />
          </FormField>
          <FormField label="Horas activas al mes">
            <input type="number" min={1} max={744} className={inputClasses} value={hours} onChange={(e) => setHours(Math.min(744, Math.max(1, Number(e.target.value))))} />
            <p className="text-[11px] text-text-secondary mt-1">Horas estimadas de uso durante un mes (máximo 744).</p>
            <div className="flex flex-wrap gap-1.5 mt-2" aria-label="Presets de horas de uso">
              {[{ label: "24 h", value: 24 }, { label: "160 h", value: 160 }, { label: "730 h", value: 730 }].map((preset) => (
                <button key={preset.value} type="button" onClick={() => setHours(preset.value)} className={`px-2 py-1 rounded-md border text-[11px] transition-colors ${hours === preset.value ? "border-primary bg-primary/10 text-primary" : "border-border text-text-secondary hover:border-primary/50"}`}>
                  {preset.label}
                </button>
              ))}
            </div>
          </FormField>
          <div className="rounded-lg bg-primary/5 border border-primary/15 px-3 py-2.5">
            <p className="text-[11px] text-text-secondary">Estimación mensual</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(previewMonthly)}</p>
            <p className="text-[11px] text-text-secondary">{formatCurrency(unitCost)} por unidad/hora</p>
          </div>
          <button type="submit" className="inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
            <Plus size={17} /> Agregar
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-card shadow-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cost/10 text-cost flex items-center justify-center"><PiggyBank size={19} /></div>
          <div><p className="text-xs text-text-secondary">Proyección mensual</p><p className="text-xl font-bold text-text-primary">{formatCurrency(totals.monthly)}</p></div>
        </div>
        <div className="bg-card border border-border rounded-card shadow-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-security/10 text-security flex items-center justify-center"><TrendingDown size={19} /></div>
          <div><p className="text-xs text-text-secondary">Ahorro potencial anual</p><p className="text-xl font-bold text-text-primary">{formatCurrency(totals.projectedSavings)}</p></div>
        </div>
        <div className="bg-card border border-border rounded-card shadow-card p-4">
          <div className="flex justify-between items-center gap-3 mb-2"><p className="text-xs text-text-secondary">Uso del presupuesto</p><span className="text-xs font-semibold text-text-primary">{totals.budgetUsed.toFixed(0)}%</span></div>
          <input type="number" min={0} className={`${inputClasses} py-1 text-xs mb-2`} value={budget} onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))} aria-label="Presupuesto mensual" />
          <div className="h-1.5 bg-background rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${totals.budgetUsed > 100 ? "bg-alert" : "bg-primary"}`} style={{ width: `${Math.min(totals.budgetUsed, 100)}%` }} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold text-text-primary">Estimaciones ({estimates.length})</h2>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => downloadReport("cloudops-costos.json", { estimates, totals })} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/75" disabled={estimates.length === 0}><Download size={14} /> Exportar</button>
              {estimates.length > 0 && <button type="button" onClick={clearCostEstimates} className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-alert"><RotateCcw size={14} /> Limpiar</button>}
            </div>
          </div>

          {estimates.length === 0 ? (
            <p className="text-sm text-text-secondary">Agrega un servicio para ver la estimación.</p>
          ) : (
            <div className="space-y-3 mb-4">
                {estimates.map((e) => (
                  <CostCard key={e.id} estimate={e} onRemove={removeCostEstimate} />
              ))}
            </div>
          )}

          <div className="bg-card border border-border rounded-card shadow-card p-5 flex justify-between">
            <span className="text-sm font-medium text-text-primary">Costo total</span>
            <div className="text-right">
              <p className="text-lg font-bold text-cost">{formatCurrency(totals.monthly)}<span className="text-xs font-normal text-text-secondary"> por mes</span></p>
              <p className="text-xs text-text-secondary">Proyección anual: {formatCurrency(totals.annual)}</p>
            </div>
          </div>
        </div>

        <div>
          <ChartCard title="Comparativa por servicio">
            {estimates.length === 0 ? (
              <p className="text-sm text-text-secondary">Sin datos aún.</p>
            ) : (
              <div className="h-[280px]"><Bar data={chartData} options={chartOptions} /></div>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}