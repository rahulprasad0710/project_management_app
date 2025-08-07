import type { IStatusOptions } from "@/types/config.types";

export const statusOptions: IStatusOptions[] = [
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "FOR_FIX", label: "For Fix" },
    { value: "UNDER_REVIEW", label: "Under Review" },
    { value: "COMPLETED", label: "Completed" },
];
