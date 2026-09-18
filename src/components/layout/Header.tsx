interface HeaderProps {
    title: string;
    subtitle?: string;
}

// Header genérico: cada página le pasa su propio título/subtítulo.
// Así no se crea un Header distinto por módulo (cero duplicado).
export default function Header({ title, subtitle }: HeaderProps) {
    return (
        <header className="mb-6">
            <h1 className="text-[28px] font-bold text-text-primary leading-tight">
                {title}
            </h1>
            {subtitle && (
                <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
            )}
        </header>
    );
}