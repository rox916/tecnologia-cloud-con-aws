import type { ReactNode } from "react";

interface FormFieldProps {
    label: string;
    children: ReactNode;
    fullWidth?: boolean;
}

export default function FormField({ label, children, fullWidth = false }: FormFieldProps) {
    return (
        <div className={fullWidth ? "sm:col-span-2" : ""}>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
                {label}
            </label>
            {children}
        </div>
    );
}