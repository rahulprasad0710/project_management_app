type BadgeType =
    | "primary"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "light"
    | "dark";

type Props = {
    badgeType: BadgeType;
    title: string;
};

const Badge = ({ badgeType, title }: Props) => {
    let badgeClass = "";

    switch (badgeType) {
        case "primary":
            badgeClass =
                "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400";
            break;
        case "success":
            badgeClass =
                "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500";
            break;
        case "error":
            badgeClass =
                "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
            break;
        case "warning":
            badgeClass =
                "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400";
            break;
        case "info":
            badgeClass =
                "bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500";
            break;
        case "light":
            badgeClass =
                "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80";
            break;
        case "dark":
            badgeClass =
                "bg-gray-500 text-white dark:bg-white/5 dark:text-white";
            break;
        default:
            badgeClass =
                "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }

    return (
        <span
            className={`inline-flex items-center justify-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium ${badgeClass}`}
        >
            {title}
        </span>
    );
};

export default Badge;
