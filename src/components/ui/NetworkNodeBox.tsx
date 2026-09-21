import type { LucideIcon } from "lucide-react";

interface NetworkNodeBoxProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

export default function NetworkNodeBox({ label, icon: Icon, isActive, onClick }: NetworkNodeBoxProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 px-4 py-4 rounded-card border-2 transition-all shrink-0 w-28 ${
        isActive
          ? "border-primary bg-primary/5 shadow-card"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isActive ? "bg-primary text-white" : "bg-background text-text-secondary"
        }`}
      >
        <Icon size={20} />
      </div>
      <span className="text-xs font-semibold text-text-primary text-center leading-tight">
        {label}
      </span>
    </button>
  );
}