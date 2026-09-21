import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";

interface FormFieldProps {
    label: string;
    children: ReactNode;
    fullWidth?: boolean;
}

export default function FormField({ label, children, fullWidth = false }: FormFieldProps) {
    const fieldId = useId();
    const control = isValidElement(children)
        ? cloneElement(children as ReactElement<{ id?: string; "aria-label"?: string }>, { id: fieldId, "aria-label": label })
        : children;
    return (
        <div className={fullWidth ? "sm:col-span-2" : ""}>
            <label htmlFor={fieldId} className="block text-sm font-medium text-text-primary mb-1.5">
                {label}
            </label>
            {control}
        </div>
    );
}