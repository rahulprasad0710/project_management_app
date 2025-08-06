import React from "react";

export type ProjectStatus =
  | "TODO"
  | "STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "UNDER_REVIEW";

interface Props {
  status: ProjectStatus;
}

const statusStyles: Record<ProjectStatus, string> = {
  TODO: "bg-gray-100 text-gray-800",
  STARTED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  UNDER_REVIEW: "bg-purple-100 text-purple-800",
};

const statusLabels: Record<ProjectStatus, string> = {
  TODO: "To Do",
  STARTED: "Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  UNDER_REVIEW: "Under Review",
};

export const ProjectStatusBadge: React.FC<Props> = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
};
