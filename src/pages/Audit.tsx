import { useEffect, useState } from 'react';
import { Globe, MapPin, RefreshCw, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { RegistroAuditoria } from '../types/cloud';

export default function Audit() {
    const [logs, setLogs] = useState<RegistroAuditoria[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [ubicacionActual, setUbicacionActual] = useState<{ lat: number; lng: number } | null>(null);

    // Cargar logs desde Supabase
    const obtenerLogs = async () => {
        setCargando(true);
        const { data, error } = await supabase
            .from('registro_auditoria')
            .select('*')
            .order('fecha_hora', { ascending: false });

        if (!error && data) {
            setLogs(data as RegistroAuditoria[]);
        }
        setCargando(false);
    };

    // Obtener geolocalización GPS del navegador
    useEffect(() => {
        obtenerLogs();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUbicacionActual({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    });
                },
                (err) => console.log('Ubicación no disponible:', err.message)
            );
        }
    }, []);

    const getBadgeAccion = (accion: string) => {
        switch (accion) {
            case 'CREAR':
                return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">CREAR</span>;
            case 'ELIMINAR':
                return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-rose-100 text-rose-800">ELIMINAR</span>;
            case 'MODIFICAR':
                return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800">MODIFICAR</span>;
            default:
                return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-800">ACCESO</span>;
        }
    };

    return (
        <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
            <div>
                <h1 className="text-2xl font-bold text-[#1E293B]">Auditoría y Trazabilidad del Sistema</h1>
                <p className="text-[#64748B] text-sm mt-1">
                    Historial de eventos, cambios y trazabilidad geoespacial de conexiones en tiempo real.
                </p>
            </div>

            {/* Tarjetas de Métricas y Conexión Actual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Origen de Conexiones */}
                <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-sm flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-50 text-[#2563EB]">
                        <Globe className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-[#64748B] uppercase">Origen de Conexiones</p>
                        <p className="text-lg font-bold text-[#1E293B] mt-0.5">Perú</p>
                        <p className="text-xs text-[#64748B]">Región Principal / AWS sa-east-1</p>
                    </div>
                </div>

                {/* Conexión Actual (GPS) */}
                <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-sm flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-[#64748B] uppercase">Conexión Actual (GPS)</p>
                        {ubicacionActual ? (
                            <div className="mt-0.5">
                                <a
                                    href={`https://www.google.com/maps?q=${ubicacionActual.lat},${ubicacionActual.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                                >
                                    {ubicacionActual.lat.toFixed(4)}, {ubicacionActual.lng.toFixed(4)}
                                </a>
                                <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                                    Ubicación Verificada
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 mt-1">Obteniendo coordenadas GPS...</p>
                        )}
                    </div>
                </div>

                {/* Total Registros */}
                <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-sm flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-100 text-[#0F172A]">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-[#64748B] uppercase">Total de Eventos en BD</p>
                        <p className="text-2xl font-bold text-[#1E293B] mt-0.5">{logs.length}</p>
                    </div>
                </div>
            </div>

            {/* Tabla de Logs de Auditoría */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center">
                    <h2 className="text-md font-semibold text-[#1E293B]">Logs Registrados en Supabase</h2>
                    <button
                        onClick={obtenerLogs}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded flex items-center gap-1.5 transition"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Actualizar
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {cargando ? (
                        <div className="p-8 text-center text-xs text-slate-500">Cargando registros desde Supabase...</div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0] text-xs uppercase">
                                <tr>
                                    <th className="p-3 font-medium">Fecha / Hora</th>
                                    <th className="p-3 font-medium">Usuario</th>
                                    <th className="p-3 font-medium">Acción</th>
                                    <th className="p-3 font-medium">Módulo</th>
                                    <th className="p-3 font-medium">Descripción</th>
                                    <th className="p-3 font-medium">Ubicación GPS (JSONB)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E8F0] text-xs">
                                {logs.map((log) => {
                                    const coords = log.datos_geo?.coordenadas;
                                    return (
                                        <tr key={log.id} className="hover:bg-slate-50">
                                            <td className="p-3 font-mono text-slate-600">
                                                {new Date(log.fecha_hora).toLocaleString('es-PE')}
                                            </td>
                                            <td className="p-3 font-medium text-[#1E293B]">{log.nombre_usuario}</td>
                                            <td className="p-3">{getBadgeAccion(log.accion)}</td>
                                            <td className="p-3 text-slate-600">{log.modulo}</td>
                                            <td className="p-3 text-slate-800">{log.descripcion}</td>
                                            <td className="p-3 font-mono">
                                                {coords ? (
                                                    <a
                                                        href={`https://www.google.com/maps?q=${coords.latitud},${coords.longitud}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[#2563EB] hover:underline flex items-center gap-1"
                                                    >
                                                        <MapPin className="w-3 h-3" />
                                                        {coords.latitud.toFixed(3)}, {coords.longitud.toFixed(3)}
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400">Sin GPS</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}