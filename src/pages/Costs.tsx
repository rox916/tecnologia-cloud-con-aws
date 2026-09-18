import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import '../utils/chartSetup';
import { INITIAL_COST_ITEMS, SERVICE_RATES } from '../data/mockData';
import type { CostItem } from '../types/cloud';

export const Costs: React.FC = () => {
    const [items, setItems] = useState<CostItem[]>(INITIAL_COST_ITEMS);

    // Form State
    const [selectedService, setSelectedService] = useState<string>('Amazon EC2');
    const [quantity, setQuantity] = useState<number>(1);
    const [hours, setHours] = useState<number>(730);

    // Cálculos dinámicos
    const currentRate = SERVICE_RATES[selectedService] || 0.10;
    const estimatedCost = quantity * hours * currentRate;
    const estimatedMonthly = estimatedCost;
    const estimatedAnnual = estimatedMonthly * 12;

    // Totales acumulados
    const totalMonthly = items.reduce((acc, curr) => acc + curr.monthlyCost, 0);
    const totalAnnual = totalMonthly * 12;

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        const newItem: CostItem = {
            id: Date.now().toString(),
            service: selectedService,
            quantity,
            hoursPerMonth: hours,
            hourlyRate: currentRate,
            monthlyCost: estimatedMonthly,
            annualCost: estimatedAnnual,
        };
        setItems([...items, newItem]);
    };

    const handleDeleteItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    // Datos para el gráfico de distribución
    const chartData = {
        labels: items.map((i) => i.service),
        datasets: [
            {
                data: items.map((i) => i.monthlyCost),
                backgroundColor: [
                    '#2563EB', // Principal
                    '#F59E0B', // Costos
                    '#16A34A', // Seguridad
                    '#0F172A', // Sidebar
                    '#64748B', // Texto secundario
                    '#DC2626', // Alertas
                ],
                borderWidth: 1,
                borderColor: '#FFFFFF',
            },
        ],
    };

    return (
        <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#1E293B]">Costos y Economía Cloud</h1>
                <p className="text-[#64748B] text-sm">Estimación y análisis de costos operativos de la infraestructura</p>
            </div>

            {/* Tarjetas resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-sm">
                    <p className="text-xs font-semibold text-[#64748B] uppercase">Costo Total Mensual</p>
                    <p className="text-3xl font-bold text-[#F59E0B] mt-1">${totalMonthly.toFixed(2)}</p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-sm">
                    <p className="text-xs font-semibold text-[#64748B] uppercase">Costo Total Anual</p>
                    <p className="text-3xl font-bold text-[#2563EB] mt-1">${totalAnnual.toFixed(2)}</p>
                </div>
            </div>

            {/* Formulario + Gráfico */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formularios de Estimación */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Estimador de Costos</h2>
                    <form onSubmit={handleAddItem} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-[#1E293B] mb-1">Servicio</label>
                                <select
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                    className="w-full p-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-none focus:border-[#2563EB]"
                                >
                                    {Object.keys(SERVICE_RATES).map((srv) => (
                                        <option key={srv} value={srv}>{srv}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#1E293B] mb-1">Cantidad</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-full p-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-none focus:border-[#2563EB]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#1E293B] mb-1">Horas estimadas (mes)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="730"
                                    value={hours}
                                    onChange={(e) => setHours(Number(e.target.value))}
                                    className="w-full p-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-none focus:border-[#2563EB]"
                                />
                            </div>
                        </div>

                        {/* Cálculos proyectados */}
                        <div className="grid grid-cols-3 gap-3 bg-[#F8FAFC] p-4 rounded-md border border-[#E2E8F0]">
                            <div>
                                <span className="block text-xs text-[#64748B]">Costo Estimado/Hora</span>
                                <span className="font-semibold text-[#1E293B]">${currentRate.toFixed(2)}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-[#64748B]">Costo Mensual</span>
                                <span className="font-semibold text-[#F59E0B]">${estimatedMonthly.toFixed(2)}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-[#64748B]">Costo Anual</span>
                                <span className="font-semibold text-[#2563EB]">${estimatedAnnual.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-[#2563EB] text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Agregar a la Estimación
                        </button>
                    </form>
                </div>

                {/* Gráfico de Distribución */}
                <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-2">Distribución de Costos</h2>
                    <div className="w-full max-w-[240px] mx-auto py-2">
                        <Doughnut data={chartData} options={{ maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>
            </div>

            {/* Tabla de resumen de servicios */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#E2E8F0]">
                    <h2 className="text-md font-semibold text-[#1E293B]">Desglose de Servicios Estimados</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0]">
                            <tr>
                                <th className="p-3 font-medium">Servicio</th>
                                <th className="p-3 font-medium">Cantidad</th>
                                <th className="p-3 font-medium">Horas</th>
                                <th className="p-3 font-medium">Costo Mensual</th>
                                <th className="p-3 font-medium">Costo Anual</th>
                                <th className="p-3 font-medium text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-medium text-[#1E293B]">{item.service}</td>
                                    <td className="p-3 text-[#64748B]">{item.quantity}</td>
                                    <td className="p-3 text-[#64748B]">{item.hoursPerMonth}h</td>
                                    <td className="p-3 text-[#F59E0B] font-medium">${item.monthlyCost.toFixed(2)}</td>
                                    <td className="p-3 text-[#2563EB] font-medium">${item.annualCost.toFixed(2)}</td>
                                    <td className="p-3 text-right">
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="text-[#DC2626] hover:underline text-xs"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Costs;