// src/data/awsServices.ts
import type { AwsService } from "../types/cloud";

export const awsServices: AwsService[] = [
    {
        id: "ec2",
        name: "EC2",
        category: "Compute",
        description: "Servidores virtuales escalables bajo demanda.",
        mainFunction: "Ejecutar cargas de trabajo de cómputo",
        status: "active",
    },
    {
        id: "s3",
        name: "S3",
        category: "Storage",
        description: "Almacenamiento de objetos altamente duradero.",
        mainFunction: "Guardar y servir archivos estáticos y backups",
        status: "active",
    },
    {
        id: "rds",
        name: "RDS",
        category: "Database",
        description: "Bases de datos relacionales administradas.",
        mainFunction: "Persistencia de datos transaccionales",
        status: "active",
    },
    {
        id: "iam",
        name: "IAM",
        category: "Security",
        description: "Gestión de identidades, usuarios y permisos.",
        mainFunction: "Controlar el acceso a recursos AWS",
        status: "active",
    },
    {
        id: "vpc",
        name: "VPC",
        category: "Networking",
        description: "Red privada virtual aislada dentro de AWS.",
        mainFunction: "Aislar y segmentar la infraestructura de red",
        status: "active",
    },
    {
        id: "route53",
        name: "Route 53",
        category: "Networking",
        description: "Servicio de DNS administrado y altamente disponible.",
        mainFunction: "Resolver dominios hacia los recursos de la app",
        status: "available",
    },
    {
        id: "cloudfront",
        name: "CloudFront",
        category: "Networking",
        description: "Red de distribución de contenido (CDN).",
        mainFunction: "Acelerar la entrega de contenido estático/dinámico",
        status: "available",
    },
];