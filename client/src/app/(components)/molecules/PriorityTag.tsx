import { ChevronsDown, ChevronsUp, Menu, WrapText } from "lucide-react";

import { Priority } from "@/types/user.types";

type Props = {
  priority: Priority;
  withLabel?: boolean;
};

const PriorityTag = ({ priority, withLabel }: Props) => {
  switch (priority) {
    case "HIGH":
      return (
        <div className="flex items-center gap-2">
          <ChevronsUp className="text-red-500" size={18} />
          {withLabel && <div>High</div>}
        </div>
      );

    case "MEDIUM":
      return (
        <div className="flex items-center gap-2">
          <Menu className="text-teal-500" size={18} />
          {withLabel && <div>Medium</div>}
        </div>
      );
    case "LOW":
      return (
        <div className="flex items-center gap-2">
          <ChevronsDown className="text-teal-500" size={18} />
          {withLabel && <div>Low</div>}
        </div>
      );
    case "BACKLOG":
      return (
        <div className="flex items-center gap-2">
          <WrapText className="text-gray-500" size={18} />
          {withLabel && <div>Backlog</div>}
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2">
          <Menu className="text-teal-500" size={18} />
          {withLabel && <div>Medium</div>}
        </div>
      );
  }
};

export default PriorityTag;
