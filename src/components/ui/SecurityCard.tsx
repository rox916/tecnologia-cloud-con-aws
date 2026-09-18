import type { SecurityIndicator } from "../../types/cloud";
import StatusBadge from "./StatusBadge";

interface SecurityCardProps {
    indicator: SecurityIndicator;
}

export default function SecurityCard({ indicator }: SecurityCardProps) {
    return (
        <div className="bg-card border border-border rounded-card shadow-card p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-text-primary">{indicator.title}</h3>
                <StatusBadge status={indicator.status} />
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
                {indicator.description}
            </p>
        </div>
    );
}