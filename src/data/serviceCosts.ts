// src/data/serviceCosts.ts
// Tarifa simulada por hora (USD) para cada servicio del catálogo.
// Se separa de awsServices.ts porque es un dato distinto (precio, no descripción)
// y así cada archivo tiene una sola responsabilidad.
export const hourlyRates: Record<string, number> = {
  ec2: 0.096,       // t3.medium on-demand aprox.
  s3: 0.023,        // por GB-mes, simplificado a "por hora" para el simulador
  rds: 0.145,
  iam: 0,           // IAM no tiene costo directo
  vpc: 0.01,        // NAT Gateway aprox.
  route53: 0.006,
  cloudfront: 0.02,
};