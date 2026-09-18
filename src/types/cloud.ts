// src/types/cloud.ts

// ---------- Comunes ----------
export type StatusLevel = "success" | "warning" | "danger";

export interface NavItem {
    label: string;
    path: string;
    icon: string; // nombre del icono de lucide-react
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
    name: string;          // "EC2", "S3", etc.
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
    selectedServices: string[]; // ids de AwsService
    migrationGoal: MigrationGoal;
    createdAt: string; // ISO date
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

// ---------- Módulo: Infraestructura Global ----------
export interface Region {
    id: string;
    code: string;       // "us-east-1"
    name: string;        // "N. Virginia"
    location: string;    // "Estados Unidos"
    deployedServices: string[];
    status: StatusLevel;
}

// ---------- Módulo: Seguridad ----------
export interface SecurityIndicator {
    id: string;
    title: string;             // "Responsabilidad Compartida", "IAM", etc.
    description: string;
    status: StatusLevel;
}

// ---------- Módulo: Arquitectura de Red ----------
export interface NetworkNode {
    id: string;
    label: string;   // "Internet", "Route 53", "CloudFront", "VPC", "EC2/RDS"
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