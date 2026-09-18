// src/types/cloud.ts

// ---------- Comunes ----------
export type StatusLevel = "success" | "warning" | "danger";

export interface NavItem {
    label: string;
    path: string;
    icon: string;
}

// ---------- Módulo: Costos ----------
export interface CostEstimate {
    id: string;
    serviceId: string;
    serviceName: string;
    quantity: number;
    estimatedHours: number;
    unitCost: number;
    monthlyCost: number;
    annualCost: number;
}

export interface CostItem {
    id: string;
    service: string;
    quantity: number;
    hoursPerMonth: number;
    hourlyRate: number;
    monthlyCost: number;
    annualCost: number;
}

// ---------- Módulo: Servicios AWS ----------
export type ServiceCategory =
    | "Compute"
    | "Storage"
    | "Database"
    | "Security"
    | "Networking";

export interface AwsService {
    id: string;
    name: string;
    category: ServiceCategory;
    description: string;
    mainFunction: string;
    status: "active" | "available" | "inactive";
}

// ---------- Módulo: Planificación Cloud ----------
export type ApplicationType = "Web App" | "API" | "E-commerce" | "Mobile Backend" | "Data Analytics";
export type AvailabilityLevel = "Básica (99%)" | "Alta (99.9%)" | "Crítica (99.99%)";
export type MigrationGoal = "Reducción de costos" | "Escalabilidad" | "Modernización" | "Disaster Recovery";

export interface CloudProposal {
    id: string;
    solutionName: string;
    applicationType: ApplicationType;
    description: string;
    region: string;
    estimatedUsers: number;
    availability: AvailabilityLevel;
    selectedServices: string[];
    migrationGoal: MigrationGoal;
    createdAt: string;
}

// ---------- Módulo: Infraestructura Global ----------
export interface Region {
    id: string;
    code: string;           // ej. "us-east-1"
    name: string;           // ej. "EE. UU. Este (N. Virginia)"
    location: string;       // ej. "Norteamérica"
    azCount: number;        // Zonas de Disponibilidad (ej. 6)
    latencyMs: number;      // Latencia media estimada
    deployedServices: string[]; // Nombres de servicios desplegados
    status: StatusLevel;    // "success" (Activo), "warning" (Degradado/Mantenimiento), "danger" (Inactivo)
}

// ---------- Módulo: Seguridad ----------
export interface SecurityIndicator {
    id: string;
    title: string;
    description: string;
    status: StatusLevel;
}

// ---------- Módulo: Arquitectura de Red ----------
export interface NetworkNode {
    id: string;
    label: string;
    description: string;
}

// ---------- Dashboard (resumen agregado) ----------
export interface DashboardSummary {
    servicesUsed: number;
    selectedRegion: string;
    monthlyCost: number;
    annualCost: number;
    securityStatus: StatusLevel;
    cloudResources: number;
    architectureStatus: StatusLevel;
}