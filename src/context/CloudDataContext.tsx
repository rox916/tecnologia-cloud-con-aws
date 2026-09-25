// src/context/CloudDataContext.tsx
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { CloudProposal, CostEstimate } from "../types/cloud";
import { supabase } from "../lib/supabase";
import { registrarAuditoria } from "../utils/auditLogger";

export interface ActivityEntry {
  id: string;
  message: string;
  timestamp: string; // hora local legible
}

export interface NotificationEntry {
  id: string;
  message: string;
  createdAt: string;
}

interface CloudDataContextValue {
  proposals: CloudProposal[];
  costEstimates: CostEstimate[];
  activityLog: ActivityEntry[];
  addProposal: (proposal: CloudProposal) => Promise<void>;
  addCostEstimate: (estimate: CostEstimate) => Promise<void>;
  removeCostEstimate: (id: string) => Promise<void>;
  clearCostEstimates: () => Promise<void>;
  selectedRegionId: string;
  setSelectedRegionId: (id: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  notifications: NotificationEntry[];
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
}

const CloudDataContext = createContext<CloudDataContextValue | null>(null);

const seedProposals: CloudProposal[] = [
  {
    id: "seed-portal-clientes",
    solutionName: "Portal de clientes",
    applicationType: "Web App",
    description: "Aplicación web para autoatención y soporte del cliente.",
    region: "us-east-1 (N. Virginia)",
    estimatedUsers: 250000,
    availability: "Alta (99.9%)",
    selectedServices: ["ec2", "s3", "rds", "cloudfront"],
    migrationGoal: "Escalabilidad",
    createdAt: "2026-09-01T10:00:00.000Z",
  },
  {
    id: "seed-api-pagos",
    solutionName: "API de pagos",
    applicationType: "API",
    description: "Microservicios para procesamiento transaccional internacional.",
    region: "sa-east-1 (São Paulo)",
    estimatedUsers: 120000,
    availability: "Crítica (99.99%)",
    selectedServices: ["ec2", "rds", "vpc", "route53"],
    migrationGoal: "Modernización",
    createdAt: "2026-09-05T09:30:00.000Z",
  },
  {
    id: "seed-ecommerce",
    solutionName: "E-commerce regional",
    applicationType: "E-commerce",
    description: "Tienda digital con tráfico estacional y catálogo global.",
    region: "eu-west-1 (Irlanda)",
    estimatedUsers: 80000,
    availability: "Alta (99.9%)",
    selectedServices: ["ec2", "s3", "cloudfront", "rds"],
    migrationGoal: "Reducción de costos",
    createdAt: "2026-09-10T15:45:00.000Z",
  },
];

const seedCostEstimates: CostEstimate[] = [
  { id: "seed-cost-1", proposalId: "seed-portal-clientes", serviceId: "ec2", serviceName: "EC2", quantity: 4, estimatedHours: 730, unitCost: 0.12, monthlyCost: 350.4, annualCost: 4204.8 },
  { id: "seed-cost-2", proposalId: "seed-portal-clientes", serviceId: "s3", serviceName: "S3", quantity: 2, estimatedHours: 730, unitCost: 0.03, monthlyCost: 43.8, annualCost: 525.6 },
  { id: "seed-cost-3", proposalId: "seed-portal-clientes", serviceId: "cloudfront", serviceName: "CloudFront", quantity: 1, estimatedHours: 730, unitCost: 0.14, monthlyCost: 102.2, annualCost: 1226.4 },
  { id: "seed-cost-4", proposalId: "seed-api-pagos", serviceId: "ec2", serviceName: "EC2", quantity: 6, estimatedHours: 730, unitCost: 0.18, monthlyCost: 788.4, annualCost: 9460.8 },
  { id: "seed-cost-5", proposalId: "seed-api-pagos", serviceId: "rds", serviceName: "RDS", quantity: 2, estimatedHours: 730, unitCost: 0.22, monthlyCost: 321.2, annualCost: 3854.4 },
  { id: "seed-cost-6", proposalId: "seed-ecommerce", serviceId: "s3", serviceName: "S3", quantity: 3, estimatedHours: 730, unitCost: 0.04, monthlyCost: 87.6, annualCost: 1051.2 },
  { id: "seed-cost-7", proposalId: "seed-ecommerce", serviceId: "cloudfront", serviceName: "CloudFront", quantity: 2, estimatedHours: 730, unitCost: 0.12, monthlyCost: 175.2, annualCost: 2102.4 },
];

function nowLabel(): string {
  return new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function CloudDataProvider({ children }: { children: ReactNode }) {
  const [proposals, setProposals] = useState<CloudProposal[]>(() => readStorage("cloudops:proposals", seedProposals));
  const [costEstimates, setCostEstimates] = useState<CostEstimate[]>(() => readStorage("cloudops:costs", seedCostEstimates));
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>(() => readStorage("cloudops:activity", []));
  const [selectedRegionId, setSelectedRegionId] = useState(() => readStorage("cloudops:region", "us-east-1"));
  const [theme, setTheme] = useState<"light" | "dark">(() => readStorage("cloudops:theme", "light"));
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);

  // Guardar en localStorage como backup
  useEffect(() => { localStorage.setItem("cloudops:proposals", JSON.stringify(proposals)); }, [proposals]);
  useEffect(() => { localStorage.setItem("cloudops:costs", JSON.stringify(costEstimates)); }, [costEstimates]);
  useEffect(() => { localStorage.setItem("cloudops:activity", JSON.stringify(activityLog)); }, [activityLog]);
  useEffect(() => { localStorage.setItem("cloudops:region", selectedRegionId); }, [selectedRegionId]);
  useEffect(() => {
    localStorage.setItem("cloudops:theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // CARGAR DATOS DESDE SUPABASE AL INICIAR
  const loadSupabaseData = useCallback(async () => {
    try {
      // 1. Cargar Propuestas desde Supabase
      const { data: pData } = await supabase.from('propuesta_cloud').select('*').order('creado_en', { ascending: false });
      if (pData && pData.length > 0) {
        const mappedProposals: CloudProposal[] = pData.map((p) => ({
          id: p.id,
          solutionName: p.nombre_solucion,
          applicationType: p.tipo_aplicacion,
          description: p.descripcion || '',
          region: p.region,
          estimatedUsers: p.usuarios_estimados || 100,
          availability: p.nivel_disponibilidad,
          selectedServices: p.servicios_seleccionados || [],
          migrationGoal: p.meta_migracion,
          createdAt: p.creado_en,
        }));
        setProposals(mappedProposals);
      }

      // 2. Cargar Estimaciones desde Supabase
      const { data: cData } = await supabase.from('estimacion_costo').select('*');
      if (cData && cData.length > 0) {
        const mappedEstimates: CostEstimate[] = cData.map((c) => ({
          id: c.id,
          proposalId: c.propuesta_id,
          serviceId: c.servicio_id || '',
          serviceName: c.nombre_servicio,
          quantity: c.cantidad,
          estimatedHours: c.horas_mes,
          unitCost: Number(c.tarifa_hora),
          monthlyCost: Number(c.costo_mensual),
          annualCost: Number(c.costo_anual),
        }));
        setCostEstimates(mappedEstimates);
      }
    } catch (err) {
      console.warn("Conexión inicial a Supabase no disponible, usando caché local.");
    }
  }, []);

  useEffect(() => {
    loadSupabaseData();
  }, [loadSupabaseData]);

  const logActivity = useCallback((message: string) => {
    setActivityLog((prev) => [{ id: crypto.randomUUID(), message, timestamp: nowLabel() }, ...prev].slice(0, 8));
  }, []);

  const notify = useCallback((message: string) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, message, createdAt: nowLabel() }].slice(-12));
    window.setTimeout(() => setNotifications((prev) => prev.filter((item) => item.id !== id)), 3500);
  }, []);

  // AGREGAR PROPUESTA A SUPABASE + AUDITORÍA CON GPS
  const addProposal = useCallback(async (proposal: CloudProposal) => {
    // Estado local reactivo
    setProposals((prev) => [proposal, ...prev]);
    logActivity(`Nueva propuesta registrada: "${proposal.solutionName}"`);
    notify("Propuesta registrada correctamente");

    // Insertar en Supabase
    const { error } = await supabase.from('propuesta_cloud').insert([
      {
        id: proposal.id,
        nombre_solucion: proposal.solutionName,
        tipo_aplicacion: proposal.applicationType,
        descripcion: proposal.description,
        region: proposal.region,
        usuarios_estimados: proposal.estimatedUsers,
        nivel_disponibilidad: proposal.availability,
        servicios_seleccionados: proposal.selectedServices,
        meta_migracion: proposal.migrationGoal,
      },
    ]);

    if (!error) {
      // Registro de Auditoría con GPS
      await registrarAuditoria(
        'Arquitecto Cloud',
        'CREAR',
        'Planificación',
        `Propuesta registrada: "${proposal.solutionName}"`
      );
    }
  }, [logActivity, notify]);

  // AGREGAR ESTIMACIÓN DE COSTO A SUPABASE + AUDITORÍA CON GPS
  const addCostEstimate = useCallback(async (estimate: CostEstimate) => {
    setCostEstimates((prev) => [...prev, estimate]);
    logActivity(`Estimación agregada: ${estimate.serviceName} ($${estimate.monthlyCost.toFixed(2)}/mes)`);
    notify("Estimación de costos agregada");

    const { error } = await supabase.from('estimacion_costo').insert([
      {
        id: estimate.id,
        propuesta_id: estimate.proposalId,
        servicio_id: estimate.serviceId,
        nombre_servicio: estimate.serviceName,
        cantidad: estimate.quantity,
        horas_mes: estimate.estimatedHours,
        tarifa_hora: estimate.unitCost,
      },
    ]);

    if (!error) {
      await registrarAuditoria(
        'Analista Financiero Cloud',
        'MODIFICAR',
        'Costos',
        `Agregado servicio ${estimate.serviceName} a propuesta`
      );
    }
  }, [logActivity, notify]);

  // ELIMINAR ESTIMACIÓN DE COSTO DE SUPABASE
  const removeCostEstimate = useCallback(async (id: string) => {
    const removed = costEstimates.find((estimate) => estimate.id === id);
    if (!removed) return;

    setCostEstimates((prev) => prev.filter((estimate) => estimate.id !== id));
    logActivity(`Estimación eliminada: ${removed.serviceName}`);
    notify("Estimación eliminada");

    const { error } = await supabase.from('estimacion_costo').delete().eq('id', id);

    if (!error) {
      await registrarAuditoria(
        'Analista Financiero Cloud',
        'ELIMINAR',
        'Costos',
        `Eliminado servicio ${removed.serviceName}`
      );
    }
  }, [costEstimates, logActivity, notify]);

  // LIMPIAR TODAS LAS ESTIMACIONES
  const clearCostEstimates = useCallback(async () => {
    if (costEstimates.length === 0) return;
    const totalCount = costEstimates.length;

    setCostEstimates([]);
    logActivity(`${totalCount} estimaciones limpiadas`);
    notify("Estimaciones limpiadas");

    await supabase.from('estimacion_costo').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await registrarAuditoria(
      'Analista Financiero Cloud',
      'ELIMINAR',
      'Costos',
      `Se limpiaron ${totalCount} estimaciones`
    );
  }, [costEstimates.length, logActivity, notify]);

  return (
    <CloudDataContext.Provider
      value={{
        proposals,
        costEstimates,
        activityLog,
        addProposal,
        addCostEstimate,
        removeCostEstimate,
        clearCostEstimates,
        selectedRegionId,
        setSelectedRegionId,
        theme,
        toggleTheme: () => setTheme((current) => (current === "light" ? "dark" : "light")),
        notifications,
        dismissNotification: (id) => setNotifications((prev) => prev.filter((item) => item.id !== id)),
        clearNotifications: () => setNotifications([]),
      }}
    >
      {children}
    </CloudDataContext.Provider>
  );
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useCloudData() {
  const ctx = useContext(CloudDataContext);
  if (!ctx) throw new Error("useCloudData debe usarse dentro de <CloudDataProvider>");
  return ctx;
}