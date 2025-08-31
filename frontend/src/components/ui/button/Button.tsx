import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode; // Button text or content
    size?: "sm" | "md" | "xs"; // Button size
    variant?: "primary" | "outline" | "secondary"; // Button variant
    startIcon?: ReactNode; // Icon before the text
    endIcon?: ReactNode; // Icon after the text
    onClick?: () => void; // Click handler
    disabled?: boolean; // Disabled state
    className?: string; // Disabled state ,
    type?: "button" | "submit" | "reset"; // Button type
    title?: string; // Button title
}

const Button: React.FC<ButtonProps> = ({
    children,
    size = "md",
    variant = "primary",
    startIcon,
    endIcon,
    onClick,
    className = "",
    disabled = false,
    type = "button",
    title = "",
}) => {
    // Size Classes
    const sizeClasses = {
        xs: "px-4 py-2 text-xs",
        sm: "px-4 py-2 text-sm",
        md: "px-5 py-3.5 text-sm",
    };

    // Variant Classes
    const variantClasses = {
        primary:
            "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
        outline:
            "bg-brand-100 text-brand-800 ring-1 ring-inset ring-brand-300 hover:bg-brand-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
        secondary: `inline-flex items-center justify-center gap-2 rounded-md transition
                                px-4 py-2 text-sm
                                bg-white text-brand-700 ring-1 ring-inset ring-brand-400
                                hover:bg-brand-50
                                dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-800`,
    };

    return (
        <button
            className={`inline-flex items-center justify-center gap-2 rounded-md transition ${className} ${
                sizeClasses[size]
            } ${variantClasses[variant]} ${
                disabled ? "cursor-not-allowed opacity-50" : ""
            }`}
            type={type}
            title={title}
            onClick={onClick}
            disabled={disabled}
        >
            {startIcon && (
                <span className='flex items-center'>{startIcon}</span>
            )}
            {children}
            {endIcon && <span className='flex items-center'>{endIcon}</span>}
        </button>
    );
};

export default Button;
