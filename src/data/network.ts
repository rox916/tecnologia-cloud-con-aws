// src/data/network.ts
import type { NetworkNode } from "../types/cloud";

// El orden del array define el flujo del diagrama (izquierda→derecha).
export const networkNodes: NetworkNode[] = [
  {
    id: "internet",
    label: "Internet",
    description: "Punto de entrada del tráfico de los usuarios finales hacia la aplicación.",
  },
  {
    id: "route53",
    label: "Route 53",
    description: "Resuelve el dominio de la aplicación y dirige el tráfico hacia el punto de entrada correcto (DNS administrado).",
  },
  {
    id: "cloudfront",
    label: "CloudFront",
    description: "CDN que distribuye contenido estático/dinámico desde ubicaciones cercanas al usuario, reduciendo latencia.",
  },
  {
    id: "vpc",
    label: "VPC",
    description: "Red privada virtual que aísla los recursos de cómputo y base de datos del resto de Internet.",
  },
  {
    id: "compute",
    label: "EC2 / RDS",
    description: "Dentro de la VPC: instancias EC2 procesan la lógica de la aplicación y RDS persiste los datos.",
  },
];