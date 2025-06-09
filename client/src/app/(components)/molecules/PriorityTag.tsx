import { ChevronsDown, ChevronsUp, Menu, WrapText } from "lucide-react";

import { Priority } from "@/types/user.types";

type Props = {
  priority: Priority;
};

const PriorityTag = ({ priority }: Props) => {
  switch (priority) {
    case "HIGH":
      return <ChevronsUp className="text-red-500" size={18} />;
    case "MEDIUM":
      return <Menu className="text-teal-500" size={18} />;
    case "LOW":
      return <ChevronsDown className="text-teal-500" size={18} />;
    case "BACKLOG":
      return <WrapText className="text-gray-500" size={18} />;
    default:
      return <Menu className="text-teal-500" size={18} />;
  }
};

export default PriorityTag;
