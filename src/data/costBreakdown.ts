// src/data/costBreakdown.ts
export interface CostWeight {
  service: string;
  weight: number; // proporción del costo mensual total (suma = 1)
}

export const costWeights: CostWeight[] = [
  { service: "EC2", weight: 0.42 },
  { service: "RDS", weight: 0.27 },
  { service: "S3", weight: 0.12 },
  { service: "CloudFront", weight: 0.11 },
  { service: "Route 53", weight: 0.05 },
  { service: "VPC", weight: 0.03 },
];