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

export const INITIAL_COST_ITEMS = [
    { id: '1', service: 'Amazon EC2', quantity: 2, hoursPerMonth: 730, hourlyRate: 0.10, monthlyCost: 146.00, annualCost: 1752.00 },
    { id: '2', service: 'Amazon RDS', quantity: 1, hoursPerMonth: 730, hourlyRate: 0.25, monthlyCost: 182.50, annualCost: 2190.00 },
    { id: '3', service: 'Amazon S3', quantity: 5, hoursPerMonth: 730, hourlyRate: 0.02, monthlyCost: 73.00, annualCost: 876.00 },
    { id: '4', service: 'AWS CloudFront', quantity: 1, hoursPerMonth: 730, hourlyRate: 0.11, monthlyCost: 81.00, annualCost: 972.00 },
];

export const SERVICE_RATES: Record<string, number> = {
    'Amazon EC2': 0.10,
    'Amazon RDS': 0.25,
    'Amazon S3': 0.02,
    'AWS CloudFront': 0.11,
    'AWS Lambda': 0.05,
    'Amazon VPC': 0.03,
};