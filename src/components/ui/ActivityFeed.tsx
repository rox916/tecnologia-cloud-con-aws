import { Clock } from "lucide-react";
import type { ActivityEntry } from "../../context/CloudDataContext";

interface ActivityFeedProps {
  entries: ActivityEntry[];
}

export default function ActivityFeed({ entries }: ActivityFeedProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-text-secondary">
        Aún no hay actividad. Registra una propuesta o un costo para verlo aquí.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-start gap-2.5">
          <Clock size={14} className="text-text-secondary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-text-primary">{entry.message}</p>
            <p className="text-xs text-text-secondary">{entry.timestamp}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}