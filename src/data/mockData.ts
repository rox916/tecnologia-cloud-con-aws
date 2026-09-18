// src/data/mockData.ts
import type { DashboardSummary, SecurityIndicator } from "../types/cloud";

export const dashboardSummary: DashboardSummary = {
    servicesUsed: 7,
    selectedRegion: "us-east-1 (N. Virginia)",
    monthlyCost: 482.5,
    annualCost: 5790.0,
    securityStatus: "success",
    cloudResources: 14,
    architectureStatus: "warning",
};

export const securityOverview: SecurityIndicator[] = [
    {
        id: "sec-1",
        title: "Responsabilidad Compartida",
        description: "Modelo aplicado correctamente en la propuesta actual",
        status: "success",
    },
    {
        id: "sec-2",
        title: "IAM",
        description: "Roles y políticas configurados con privilegio mínimo",
        status: "success",
    },
    {
        id: "sec-3",
        title: "Protección de Datos",
        description: "Cifrado en tránsito pendiente de revisión",
        status: "warning",
    },
];

export const monthlyCostTrend = [
    { month: "Ene", cost: 410 },
    { month: "Feb", cost: 430 },
    { month: "Mar", cost: 455 },
    { month: "Abr", cost: 440 },
    { month: "May", cost: 470 },
    { month: "Jun", cost: 482.5 },
];