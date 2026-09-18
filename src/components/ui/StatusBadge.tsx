import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { StatusLevel } from "../../types/cloud";

interface StatusBadgeProps {
    status: StatusLevel;
    label?: string;
}

const STATUS_CONFIG: Record<
    StatusLevel,
    { color: string; bg: string; Icon: typeof CheckCircle2; defaultLabel: string }
> = {
    success: { color: "text-security", bg: "bg-security/10", Icon: CheckCircle2, defaultLabel: "Correcto" },
    warning: { color: "text-cost", bg: "bg-cost/10", Icon: AlertTriangle, defaultLabel: "Requiere revisión" },
    danger: { color: "text-alert", bg: "bg-alert/10", Icon: XCircle, defaultLabel: "Problema" },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
    const { color, bg, Icon, defaultLabel } = STATUS_CONFIG[status];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color} ${bg}`}>
            <Icon size={13} />
            {label ?? defaultLabel}
        </span>
    );
}