import { Trash2 } from "lucide-react";
import type { CostEstimate } from "../../types/cloud";
import { formatCurrency } from "../../utils/format";

interface CostCardProps {
  estimate: CostEstimate;
  onRemove: (id: string) => void;
}

export default function CostCard({ estimate, onRemove }: CostCardProps) {
  return (
    <div className="bg-card border border-border rounded-card shadow-card p-4 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-text-primary">{estimate.serviceName}</h3>
        <p className="text-xs text-text-secondary mt-0.5">
          {estimate.quantity} unidad(es) · {estimate.estimatedHours} horas activas/mes · {formatCurrency(estimate.unitCost)} por unidad/hora
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-cost">{formatCurrency(estimate.monthlyCost)}<span className="text-xs font-normal text-text-secondary"> por mes</span></p>
          <p className="text-xs text-text-secondary">Proyección anual: {formatCurrency(estimate.annualCost)}</p>
        </div>
        <button
          onClick={() => onRemove(estimate.id)}
          className="text-text-secondary hover:text-alert transition-colors"
          aria-label="Eliminar estimación"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}