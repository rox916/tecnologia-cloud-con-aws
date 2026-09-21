import { useEffect, useState, type FormEvent } from "react";
import { Check, Layers, Users, Zap } from "lucide-react";
import Header from "../components/layout/Header";
import FormField from "../components/ui/FormField";
import ProposalCard from "../components/ui/ProposalCard";
import { inputClasses } from "../utils/formStyles";
import { awsServices } from "../data/awsServices";
import { APPLICATION_TYPES, AVAILABILITY_LEVELS, MIGRATION_GOALS } from "../data/formOptions";
import { regions } from "../data/regions";
import { useCloudData } from "../context/CloudDataContext";
import type { CloudProposal, ApplicationType, AvailabilityLevel, MigrationGoal } from "../types/cloud";

// Estado inicial del formulario, tipado sobre CloudProposal sin id/createdAt
type ProposalDraft = Omit<CloudProposal, "id" | "createdAt">;

const emptyDraft: ProposalDraft = {
    solutionName: "",
    applicationType: APPLICATION_TYPES[0],
    description: "",
    region: `${regions[0].code} (${regions[0].name})`,
    estimatedUsers: 100,
    availability: AVAILABILITY_LEVELS[0],
    selectedServices: [],
    migrationGoal: MIGRATION_GOALS[0],
};

export default function Planning() {
    const [draft, setDraft] = useState<ProposalDraft>(emptyDraft);
    const { proposals, addProposal, selectedRegionId, setSelectedRegionId } = useCloudData();

    useEffect(() => {
        const matchingRegion = regions.find((region) => region.id === selectedRegionId);
        const matchingLabel = matchingRegion ? `${matchingRegion.code} (${matchingRegion.name})` : undefined;
        if (matchingLabel && matchingLabel !== draft.region) {
            setDraft((current) => ({ ...current, region: matchingLabel }));
        }
    }, [selectedRegionId, draft.region]);

    const toggleService = (id: string) => {
        setDraft((prev) => ({
            ...prev,
            selectedServices: prev.selectedServices.includes(id)
                ? prev.selectedServices.filter((s) => s !== id)
                : [...prev.selectedServices, id],
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!draft.solutionName.trim()) return;

        const newProposal: CloudProposal = {
            ...draft,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };

        addProposal(newProposal);
        setDraft(emptyDraft); // limpiamos el formulario tras registrar
    };

    return (
        <div>
            <Header title="Planificación Cloud" subtitle="Registra una propuesta de solución Cloud" />

            <form
                onSubmit={handleSubmit}
                className="bg-card border border-border rounded-card shadow-card p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
                <FormField label="Nombre de la solución">
                    <input
                        className={inputClasses}
                        value={draft.solutionName}
                        onChange={(e) => setDraft({ ...draft, solutionName: e.target.value })}
                        placeholder="Ej. Portal de Clientes Codaini"
                        required
                    />
                </FormField>

                <FormField label="Tipo de aplicación">
                    <select
                        className={inputClasses}
                        value={draft.applicationType}
                        onChange={(e) => setDraft({ ...draft, applicationType: e.target.value as ApplicationType })}
                    >
                        {APPLICATION_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </FormField>

                <FormField label="Descripción" fullWidth>
                    <textarea
                        className={`${inputClasses} min-h-[80px] resize-none`}
                        value={draft.description}
                        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                        placeholder="Describe brevemente la solución..."
                    />
                </FormField>

                <FormField label="Región seleccionada">
                    <select
                        className={inputClasses}
                        value={draft.region}
                        onChange={(e) => {
                            const region = e.target.value;
                            setDraft({ ...draft, region });
                            setSelectedRegionId(regions.find((item) => `${item.code} (${item.name})` === region)?.id ?? regions[0].id);
                        }}
                    >
                        {regions.map((region) => {
                            const label = `${region.code} (${region.name})`;
                            return <option key={region.id} value={label}>{label}</option>;
                        })}
                    </select>
                </FormField>

                <FormField label="Número estimado de usuarios">
                    <input
                        type="number"
                        min={1}
                        className={inputClasses}
                        value={draft.estimatedUsers}
                        onChange={(e) => setDraft({ ...draft, estimatedUsers: Number(e.target.value) })}
                    />
                </FormField>

                <FormField label="Nivel de disponibilidad requerido">
                    <select
                        className={inputClasses}
                        value={draft.availability}
                        onChange={(e) => setDraft({ ...draft, availability: e.target.value as AvailabilityLevel })}
                    >
                        {AVAILABILITY_LEVELS.map((level) => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </FormField>

                <FormField label="Objetivo de la migración">
                    <select
                        className={inputClasses}
                        value={draft.migrationGoal}
                        onChange={(e) => setDraft({ ...draft, migrationGoal: e.target.value as MigrationGoal })}
                    >
                        {MIGRATION_GOALS.map((goal) => (
                            <option key={goal} value={goal}>{goal}</option>
                        ))}
                    </select>
                </FormField>

                <FormField label="Servicios Cloud seleccionados" fullWidth>
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <p className="text-xs text-text-secondary">Selecciona los servicios que formarán parte de tu arquitectura.</p>
                        <span className="shrink-0 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                            {draft.selectedServices.length} seleccionados
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {awsServices.map((service) => {
                            const isSelected = draft.selectedServices.includes(service.id);
                            return (
                                <button
                                    type="button"
                                    key={service.id}
                                    onClick={() => toggleService(service.id)}
                                    aria-pressed={isSelected}
                                    className={`relative text-left p-3 rounded-xl border transition-all duration-200 ${isSelected
                                        ? "bg-primary/10 border-primary shadow-sm ring-1 ring-primary/20"
                                        : "bg-background border-border hover:border-primary/50 hover:-translate-y-0.5"
                                        }`}
                                >
                                    <span className="flex items-start justify-between gap-2">
                                        <span>
                                            <span className={`block text-sm font-semibold ${isSelected ? "text-primary" : "text-text-primary"}`}>
                                                {service.name}
                                            </span>
                                            <span className="block text-[11px] text-text-secondary mt-0.5">{service.category}</span>
                                        </span>
                                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-xs transition-colors ${isSelected
                                            ? "bg-primary border-primary text-white"
                                            : "border-border text-transparent"
                                            }`}>
                                            ✓
                                        </span>
                                    </span>
                                    <span className="block text-xs text-text-secondary leading-relaxed mt-2">
                                        {service.mainFunction}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </FormField>

                <div className="sm:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        className="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Registrar propuesta
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-card border border-border rounded-card shadow-card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Layers size={19} /></div>
                    <div><p className="text-xs text-text-secondary">Servicios seleccionados</p><p className="text-xl font-bold text-text-primary">{draft.selectedServices.length}</p></div>
                </div>
                <div className="bg-card border border-border rounded-card shadow-card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-security/10 text-security flex items-center justify-center"><Users size={19} /></div>
                    <div><p className="text-xs text-text-secondary">Usuarios estimados</p><p className="text-xl font-bold text-text-primary">{draft.estimatedUsers.toLocaleString()}</p></div>
                </div>
                <div className="bg-card border border-border rounded-card shadow-card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cost/10 text-cost flex items-center justify-center"><Zap size={19} /></div>
                    <div><p className="text-xs text-text-secondary">Región activa</p><p className="text-sm font-bold text-text-primary">{selectedRegionId}</p></div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 mb-3">
                <h2 className="text-lg font-semibold text-text-primary">Propuestas registradas {proposals.length > 0 && `(${proposals.length})`}</h2>
                {draft.selectedServices.length > 0 && <span className="inline-flex items-center gap-1.5 text-xs text-security"><Check size={14} /> Borrador listo para registrar</span>}
            </div>

            {proposals.length === 0 ? (
                <p className="text-sm text-text-secondary">Aún no hay propuestas registradas.</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {proposals.map((proposal) => (
                        <ProposalCard key={proposal.id} proposal={proposal} />
                    ))}
                </div>
            )}
        </div>
    );
}