import { useState } from 'react';
import { MOCK_REGIONS } from '../data/mockData';
import type { Region, StatusLevel } from '../types/cloud';

export default function Infrastructure() {
    const [regions] = useState<Region[]>(MOCK_REGIONS);
    const [filterLocation, setFilterLocation] = useState<string>('all');

    const filteredRegions = regions.filter((region) => {
        if (filterLocation === 'all') return true;
        return region.location.toLowerCase() === filterLocation.toLowerCase();
    });

    const getStatusBadge = (status: StatusLevel) => {
        switch (status) {
            case 'success':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Operacional
                    </span>
                );
            case 'warning':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Mantenimiento
                    </span>
                );
            case 'danger':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Interrupción
                    </span>
                );
            default:
                return null;
        }
    };

    const totalDeployedServices = new Set(
        regions.flatMap((r) => r.deployedServices)
    ).size;

    return (
        <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
            <div>
                <h1 className="text-2xl font-bold text-[#1E293B]">Infraestructura Global AWS</h1>
                <p className="text-[#64748B] text-sm mt-1">
                    Visualización y estado operativo de regiones, Zonas de Disponibilidad (AZs) y servicios desplegados.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-sm">
                    <p className="text-xs font-semibold text-[#64748B] uppercase">Regiones Activas</p>
                    <p className="text-3xl font-bold text-[#2563EB] mt-1">{regions.length}</p>
                    <p className="text-xs text-[#64748B] mt-1">Presencia global multi-región</p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-sm">
                    <p className="text-xs font-semibold text-[#64748B] uppercase">Zonas de Disponibilidad</p>
                    <p className="text-3xl font-bold text-[#16A34A] mt-1">
                        {regions.reduce((acc, r) => acc + r.azCount, 0)}
                    </p>
                    <p className="text-xs text-[#64748B] mt-1">Tolerancia a fallos aislada</p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-sm">
                    <p className="text-xs font-semibold text-[#64748B] uppercase">Servicios Desplegados</p>
                    <p className="text-3xl font-bold text-[#F59E0B] mt-1">{totalDeployedServices}</p>
                    <p className="text-xs text-[#64748B] mt-1">Tipos únicos de recursos Cloud</p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-sm">
                    <p className="text-xs font-semibold text-[#64748B] uppercase">Latencia Promedio Principal</p>
                    <p className="text-3xl font-bold text-[#0F172A] mt-1">25 - 45 ms</p>
                    <p className="text-xs text-[#64748B] mt-1">Optimizada para LATAM y EE. UU.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#1E293B]">Filtrar por Región / Ubicación:</span>
                    <select
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="p-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-none focus:border-[#2563EB]"
                    >
                        <option value="all">Todas las ubicaciones</option>
                        <option value="Norteamérica">Norteamérica</option>
                        <option value="Sudamérica">Sudamérica</option>
                        <option value="Europa">Europa</option>
                    </select>
                </div>
                <span className="text-xs text-[#64748B]">
                    Mostrando {filteredRegions.length} de {regions.length} regiones disponibles
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRegions.map((region) => (
                    <div
                        key={region.id}
                        className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded border border-slate-200">
                                            {region.code}
                                        </span>
                                        <span className="text-xs font-medium text-[#64748B]">{region.location}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1E293B] mt-1">{region.name}</h3>
                                </div>
                                {getStatusBadge(region.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-2 my-4 bg-[#F8FAFC] p-3 rounded-md border border-[#E2E8F0] text-xs">
                                <div>
                                    <span className="text-[#64748B] block">Zonas de Disponibilidad:</span>
                                    <span className="font-semibold text-[#1E293B]">{region.azCount} AZs</span>
                                </div>
                                <div>
                                    <span className="text-[#64748B] block">Latencia Estimada:</span>
                                    <span className="font-semibold text-[#1E293B]">{region.latencyMs} ms</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-xs font-semibold text-[#64748B] uppercase mb-2">
                                    Servicios Desplegados en la Región
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {region.deployedServices.map((service, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-[#2563EB] rounded-md border border-blue-100"
                                        >
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#E2E8F0]">
                    <h2 className="text-md font-semibold text-[#1E293B]">Matriz Consolidada de Infraestructura Global</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0]">
                            <tr>
                                <th className="p-3 font-medium">Código</th>
                                <th className="p-3 font-medium">Nombre Región</th>
                                <th className="p-3 font-medium">Ubicación</th>
                                <th className="p-3 font-medium">AZs</th>
                                <th className="p-3 font-medium">Servicios Activos</th>
                                <th className="p-3 font-medium text-right">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                            {filteredRegions.map((region) => (
                                <tr key={region.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-mono text-xs font-semibold text-[#2563EB]">{region.code}</td>
                                    <td className="p-3 font-medium text-[#1E293B]">{region.name}</td>
                                    <td className="p-3 text-[#64748B]">{region.location}</td>
                                    <td className="p-3 text-[#64748B]">{region.azCount}</td>
                                    <td className="p-3 text-[#64748B]">{region.deployedServices.join(', ')}</td>
                                    <td className="p-3 text-right">{getStatusBadge(region.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}