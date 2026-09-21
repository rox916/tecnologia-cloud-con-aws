// src/data/security.ts
import type { SecurityIndicator } from "../types/cloud";

export const securityIndicators: SecurityIndicator[] = [
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
    title: "Protección de Cuentas",
    description: "MFA habilitado en el 80% de las cuentas administrativas",
    status: "warning",
  },
  {
    id: "sec-4",
    title: "Protección de Datos",
    description: "Cifrado en tránsito pendiente de revisión en un servicio",
    status: "warning",
  },
  {
    id: "sec-5",
    title: "Cumplimiento",
    description: "Políticas alineadas a estándares básicos de la industria",
    status: "success",
  },
];

export interface IamRole {
  id: string;
  name: string;
  users: number;
  permissions: "Administrador" | "Lectura/Escritura" | "Solo lectura";
  status: "success" | "warning" | "danger";
}

export const iamRoles: IamRole[] = [
  { id: "r1", name: "Administrador de Infraestructura", users: 2, permissions: "Administrador", status: "success" },
  { id: "r2", name: "Desarrollador Backend", users: 4, permissions: "Lectura/Escritura", status: "success" },
  { id: "r3", name: "Analista de Datos", users: 3, permissions: "Solo lectura", status: "success" },
  { id: "r4", name: "Cuenta de Servicio CI/CD", users: 1, permissions: "Lectura/Escritura", status: "warning" },
];

export const sharedResponsibility = {
  aws: [
    "Seguridad física de los centros de datos",
    "Infraestructura de hardware y red global",
    "Virtualización y aislamiento de cómputo",
  ],
  customer: [
    "Configuración de IAM y permisos",
    "Cifrado de datos en tránsito y en reposo",
    "Gestión de parches del sistema operativo",
    "Configuración de seguridad de red (VPC, Security Groups)",
  ],
};