import { NavLink } from "react-router-dom";
import {
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
];

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen bg-sidebar text-white flex flex-col fixed left-0 top-0">
            <div className="px-6 py-6 border-b border-white/10">
                <h1 className="text-lg font-bold tracking-tight">CloudOps</h1>
                <p className="text-xs text-white/50">Dashboard</p>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV_ITEMS.map(({ label, path, Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
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
    );
}