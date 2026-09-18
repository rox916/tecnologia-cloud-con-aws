// src/data/formOptions.ts
import type { ApplicationType, AvailabilityLevel, MigrationGoal } from "../types/cloud";

export const APPLICATION_TYPES: ApplicationType[] = [
    "Web App",
    "API",
    "E-commerce",
    "Mobile Backend",
    "Data Analytics",
];

export const AVAILABILITY_LEVELS: AvailabilityLevel[] = [
    "Básica (99%)",
    "Alta (99.9%)",
    "Crítica (99.99%)",
];

export const MIGRATION_GOALS: MigrationGoal[] = [
    "Reducción de costos",
    "Escalabilidad",
    "Modernización",
    "Disaster Recovery",
];

export const REGIONS = [
    "us-east-1 (N. Virginia)",
    "us-west-2 (Oregon)",
    "sa-east-1 (São Paulo)",
    "eu-west-1 (Irlanda)",
];