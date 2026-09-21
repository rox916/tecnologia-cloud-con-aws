// src/context/CloudDataContext.tsx
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { CloudProposal, CostEstimate } from "../types/cloud";

export interface ActivityEntry {
  id: string;
  message: string;
  timestamp: string; // hora local legible
}

export interface NotificationEntry {
  id: string;
  message: string;
}

interface CloudDataContextValue {
  proposals: CloudProposal[];
  costEstimates: CostEstimate[];
  activityLog: ActivityEntry[];
  addProposal: (proposal: CloudProposal) => void;
  addCostEstimate: (estimate: CostEstimate) => void;
  removeCostEstimate: (id: string) => void;
  clearCostEstimates: () => void;
  selectedRegionId: string;
  setSelectedRegionId: (id: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  notifications: NotificationEntry[];
  dismissNotification: (id: string) => void;
}

const CloudDataContext = createContext<CloudDataContextValue | null>(null);

function nowLabel(): string {
  return new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function CloudDataProvider({ children }: { children: ReactNode }) {
  const [proposals, setProposals] = useState<CloudProposal[]>(() => readStorage("cloudops:proposals", []));
  const [costEstimates, setCostEstimates] = useState<CostEstimate[]>(() => readStorage("cloudops:costs", []));
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>(() => readStorage("cloudops:activity", []));
  const [selectedRegionId, setSelectedRegionId] = useState(() => readStorage("cloudops:region", "us-east-1"));
  const [theme, setTheme] = useState<"light" | "dark">(() => readStorage("cloudops:theme", "light"));
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);

  useEffect(() => { localStorage.setItem("cloudops:proposals", JSON.stringify(proposals)); }, [proposals]);
  useEffect(() => { localStorage.setItem("cloudops:costs", JSON.stringify(costEstimates)); }, [costEstimates]);
  useEffect(() => { localStorage.setItem("cloudops:activity", JSON.stringify(activityLog)); }, [activityLog]);
  useEffect(() => { localStorage.setItem("cloudops:region", selectedRegionId); }, [selectedRegionId]);
  useEffect(() => {
    localStorage.setItem("cloudops:theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Cada acción que modifica datos también deja una entrada de actividad.
  // Se centraliza aquí para que ninguna página tenga que "recordar" hacerlo.
  const logActivity = useCallback((message: string) => {
    setActivityLog((prev) => [{ id: crypto.randomUUID(), message, timestamp: nowLabel() }, ...prev].slice(0, 8));
  }, []);

  const notify = useCallback((message: string) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, message }]);
    window.setTimeout(() => setNotifications((prev) => prev.filter((item) => item.id !== id)), 3500);
  }, []);

  const addProposal = useCallback((proposal: CloudProposal) => {
    setProposals((prev) => [proposal, ...prev]);
    logActivity(`Nueva propuesta registrada: "${proposal.solutionName}"`);
    notify("Propuesta registrada correctamente");
  }, [logActivity, notify]);

  const addCostEstimate = useCallback((estimate: CostEstimate) => {
    setCostEstimates((prev) => [...prev, estimate]);
    logActivity(`Estimación agregada: ${estimate.serviceName} ($${estimate.monthlyCost.toFixed(2)}/mes)`);
    notify("Estimación de costos agregada");
  }, [logActivity, notify]);

  const removeCostEstimate = useCallback((id: string) => {
    const removed = costEstimates.find((estimate) => estimate.id === id);
    if (!removed) return;
    setCostEstimates((prev) => prev.filter((estimate) => estimate.id !== id));
    logActivity(`Estimación eliminada: ${removed.serviceName}`);
    notify("Estimación eliminada");
  }, [costEstimates, logActivity, notify]);

  const clearCostEstimates = useCallback(() => {
    if (costEstimates.length === 0) return;
    setCostEstimates([]);
    logActivity(`${costEstimates.length} estimaciones eliminadas`);
    notify("Estimaciones limpiadas");
  }, [costEstimates, logActivity, notify]);

  return (
    <CloudDataContext.Provider
      value={{
        proposals, costEstimates, activityLog, addProposal, addCostEstimate, removeCostEstimate, clearCostEstimates,
        selectedRegionId, setSelectedRegionId, theme,
        toggleTheme: () => setTheme((current) => current === "light" ? "dark" : "light"),
        notifications,
        dismissNotification: (id) => setNotifications((prev) => prev.filter((item) => item.id !== id)),
      }}
    >
      {children}
    </CloudDataContext.Provider>
  );
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

// Hook de acceso — evita que cada componente importe useContext + CloudDataContext por separado
export function useCloudData() {
  const ctx = useContext(CloudDataContext);
  if (!ctx) throw new Error("useCloudData debe usarse dentro de <CloudDataProvider>");
  return ctx;
}