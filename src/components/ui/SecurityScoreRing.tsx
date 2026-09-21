interface SecurityScoreRingProps {
  score: number; // 0–100
}

export default function SecurityScoreRing({ score }: SecurityScoreRingProps) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#16A34A" : score >= 50 ? "#F59E0B" : "#DC2626";

  return (
    <div className="flex items-center gap-4">
      <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0">
        <circle cx="48" cy="48" r="40" fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
        />
        <text x="48" y="54" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1E293B">
          {score}%
        </text>
      </svg>
      <div>
        <p className="text-sm font-semibold text-text-primary">Puntuación de seguridad</p>
        <p className="text-xs text-text-secondary mt-0.5">
          Basado en {score >= 80 ? "indicadores en buen estado" : "indicadores que requieren revisión"}
        </p>
      </div>
    </div>
  );
}