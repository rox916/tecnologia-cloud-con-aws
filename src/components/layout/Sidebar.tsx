import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    Menu,
    X,
    LayoutDashboard,
    ClipboardList,
    DollarSign,
    Globe,
    ShieldCheck,
    Network,
    Server,
} from "lucide-react";
import type { NavItem } from "../../types/cloud";

// Centralizamos los items de navegación en un array de datos.
// Si mañana agregas/quitas un módulo, solo tocas este arreglo,
// no el JSX del componente (evita duplicación de lógica de renderizado).
const NAV_ITEMS: (NavItem & { Icon: typeof LayoutDashboard })[] = [
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard", Icon: LayoutDashboard },
    { label: "Planificación", path: "/planning", icon: "ClipboardList", Icon: ClipboardList },
    { label: "Costos", path: "/costs", icon: "DollarSign", Icon: DollarSign },
    { label: "Infraestructura", path: "/infrastructure", icon: "Globe", Icon: Globe },
    { label: "Seguridad", path: "/security", icon: "ShieldCheck", Icon: ShieldCheck },
    { label: "Arquitectura de Red", path: "/network", icon: "Network", Icon: Network },
    { label: "Servicios AWS", path: "/services", icon: "Server", Icon: Server },
    { label: "Auditoría", path: "/audit", icon: "ShieldCheck", Icon: ShieldCheck },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)} aria-label="Abrir navegación" className="lg:hidden fixed left-4 top-4 z-40 w-10 h-10 rounded-lg bg-sidebar text-white flex items-center justify-center shadow-card">
                <Menu size={19} />
            </button>
            {isOpen && <button type="button" aria-label="Cerrar navegación" onClick={() => setIsOpen(false)} className="lg:hidden fixed inset-0 z-40 bg-slate-950/50" />}
            <aside className={`${isOpen ? "flex" : "hidden"} lg:flex w-64 h-screen bg-sidebar text-white flex-col fixed left-0 top-0 z-50`}>
                <div className="px-6 py-6 border-b border-white/10">
                    <div className="flex items-center justify-between"><h1 className="text-lg font-bold tracking-tight">CloudOps</h1><button type="button" onClick={() => setIsOpen(false)} aria-label="Cerrar navegación" className="lg:hidden text-white/70 hover:text-white"><X size={18} /></button></div>
                    <p className="text-xs text-white/50">Dashboard</p>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV_ITEMS.map(({ label, path, Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary text-white"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
}