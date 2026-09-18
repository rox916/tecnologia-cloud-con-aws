import { useState, type FormEvent } from "react";
import Header from "../components/layout/Header";
import FormField from "../components/ui/FormField";
import ProposalCard from "../components/ui/ProposalCard";
import { inputClasses } from "../utils/formStyles";
import { awsServices } from "../data/awsServices";
import { APPLICATION_TYPES, AVAILABILITY_LEVELS, MIGRATION_GOALS, REGIONS } from "../data/formOptions";
import type { CloudProposal, ApplicationType, AvailabilityLevel, MigrationGoal } from "../types/cloud";

// Estado inicial del formulario, tipado sobre CloudProposal sin id/createdAt
type ProposalDraft = Omit<CloudProposal, "id" | "createdAt">;

const emptyDraft: ProposalDraft = {
    solutionName: "",
    applicationType: APPLICATION_TYPES[0],
    description: "",
    region: REGIONS[0],
    estimatedUsers: 100,
    availability: AVAILABILITY_LEVELS[0],
    selectedServices: [],
    migrationGoal: MIGRATION_GOALS[0],
};

export default function Planning() {
    const [draft, setDraft] = useState<ProposalDraft>(emptyDraft);
    const [proposals, setProposals] = useState<CloudProposal[]>([]);

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

        setProposals((prev) => [newProposal, ...prev]);
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
                        onChange={(e) => setDraft({ ...draft, region: e.target.value })}
                    >
                        {REGIONS.map((region) => (
                            <option key={region} value={region}>{region}</option>
                        ))}
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
                    <div className="flex flex-wrap gap-2">
                        {awsServices.map((service) => {
                            const isSelected = draft.selectedServices.includes(service.id);
                            return (
                                <button
                                    type="button"
                                    key={service.id}
                                    onClick={() => toggleService(service.id)}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${isSelected
                                        ? "bg-primary text-white border-primary"
                                        : "bg-background text-text-secondary border-border hover:border-primary/50"
                                        }`}
                                >
                                    {service.name}
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

            <h2 className="text-lg font-semibold text-text-primary mb-3">
                Propuestas registradas {proposals.length > 0 && `(${proposals.length})`}
            </h2>

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