import { Users, MapPin, Target } from "lucide-react";
import type { CloudProposal } from "../../types/cloud";
import { awsServices } from "../../data/awsServices";

interface ProposalCardProps {
    proposal: CloudProposal;
}

export default function ProposalCard({ proposal }: ProposalCardProps) {
    // Convertimos los ids guardados a nombres legibles para mostrarlos como chips
    const serviceNames = proposal.selectedServices
        .map((id) => awsServices.find((s) => s.id === id)?.name)
        .filter(Boolean);

    return (
        <div className="bg-card border border-border rounded-card shadow-card p-5">
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-semibold text-text-primary">{proposal.solutionName}</h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {proposal.applicationType}
                </span>
            </div>

            <p className="text-sm text-text-secondary mb-3">{proposal.description}</p>

            <div className="flex flex-wrap gap-4 text-xs text-text-secondary mb-3">
                <span className="flex items-center gap-1"><MapPin size={13} /> {proposal.region}</span>
                <span className="flex items-center gap-1"><Users size={13} /> {proposal.estimatedUsers.toLocaleString()} usuarios</span>
                <span className="flex items-center gap-1"><Target size={13} /> {proposal.migrationGoal}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
                {serviceNames.map((name) => (
                    <span key={name} className="text-xs px-2 py-0.5 rounded-md bg-background border border-border text-text-secondary">
                        {name}
                    </span>
                ))}
            </div>

            <p className="text-xs text-text-secondary">
                Disponibilidad requerida: <span className="font-medium text-text-primary">{proposal.availability}</span>
            </p>
        </div>
    );
}