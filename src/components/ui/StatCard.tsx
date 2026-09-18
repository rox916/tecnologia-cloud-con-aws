import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    accentColor?: "primary" | "security" | "cost" | "alert";
}

const ACCENT_MAP: Record<NonNullable<StatCardProps["accentColor"]>, string> = {
    primary: "text-primary bg-primary/10",
    security: "text-security bg-security/10",
    cost: "text-cost bg-cost/10",
    alert: "text-alert bg-alert/10",
};

export default function StatCard({ label, value, icon: Icon, accentColor = "primary" }: StatCardProps) {
    return (
        <div className="bg-card border border-border rounded-card shadow-card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${ACCENT_MAP[accentColor]}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-xs text-text-secondary font-medium">{label}</p>
                <p className="text-xl font-bold text-text-primary mt-0.5">{value}</p>
            </div>
        </div>
    );
}