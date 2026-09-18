import type { ReactNode } from "react";

interface ChartCardProps {
    title: string;
    children: ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
    return (
        <div className="bg-card border border-border rounded-card shadow-card p-5">
            <h2 className="text-lg font-semibold text-text-primary mb-4">{title}</h2>
            {children}
        </div>
    );
}