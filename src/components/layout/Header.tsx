import { useState } from "react";
import { Bell, Download, Moon, Sun, X } from "lucide-react";
import { useCloudData } from "../../context/CloudDataContext";
import { downloadReport } from "../../utils/exportReport";

interface HeaderProps {
    title: string;
    subtitle?: string;
}

// Header genérico: cada página le pasa su propio título/subtítulo.
// Así no se crea un Header distinto por módulo (cero duplicado).
export default function Header({ title, subtitle }: HeaderProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const { theme, toggleTheme, notifications, proposals, costEstimates, activityLog, selectedRegionId } = useCloudData();

    const exportReport = () => downloadReport("cloudops-reporte.json", {
        generatedAt: new Date().toISOString(),
        proposals,
        costEstimates,
        activityLog,
        selectedRegionId,
        theme,
    });

    return (
        <header className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
                <h1 className="text-[28px] font-bold text-text-primary leading-tight">{title}</h1>
                {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2 self-end sm:self-start">
                <button type="button" onClick={exportReport} title="Exportar reporte" aria-label="Exportar reporte" className="icon-button">
                    <Download size={17} />
                </button>
                <div className="relative">
                    <button type="button" onClick={() => setShowNotifications((current) => !current)} title="Notificaciones" aria-label="Notificaciones" className="icon-button">
                        <Bell size={17} />
                        {notifications.length > 0 && <span className="absolute -right-1 -top-1 min-w-4 h-4 px-1 rounded-full bg-alert text-white text-[10px] flex items-center justify-center">{notifications.length}</span>}
                    </button>
                    {showNotifications && <div className="absolute right-0 top-11 z-30 w-72 bg-card border border-border rounded-xl shadow-card p-3">
                        <div className="flex items-center justify-between mb-2"><p className="text-sm font-semibold text-text-primary">Notificaciones</p><button type="button" onClick={() => setShowNotifications(false)} aria-label="Cerrar notificaciones" className="text-text-secondary"><X size={15} /></button></div>
                        {notifications.length === 0 ? <p className="text-xs text-text-secondary py-3">No hay notificaciones nuevas.</p> : notifications.map((item) => <p key={item.id} className="text-xs text-text-primary border-t border-border py-2">{item.message}</p>)}
                    </div>}
                </div>
                <button type="button" onClick={toggleTheme} title="Cambiar tema" aria-label="Cambiar tema" className="icon-button">
                    {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                </button>
            </div>
        </header>
    );
}