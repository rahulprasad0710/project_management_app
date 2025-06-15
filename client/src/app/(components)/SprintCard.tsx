import { Edit } from "lucide-react";
import { ISprintResponse } from "@/types/user.types";
import { formatDistanceToNow } from "date-fns";

type Props = {
  data: ISprintResponse;
  handleEditSprint: (data: ISprintResponse) => void;
};

const SprintCard = ({ data, handleEditSprint }: Props) => {
  return (
    <div className="min-w-[380px] max-w-[380px] cursor-pointer rounded-sm bg-white p-4 shadow transition-all duration-200">
      <div className="flex w-full items-center justify-between">
        <div className="text-sm">
          {data?.isActive ? (
            <span className="inline-flex rounded-full bg-green-100 px-2 text-sm font-semibold leading-5 text-green-800">
              Active
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-red-100 px-2 text-sm font-semibold leading-5 text-red-800">
              Inactive
            </span>
          )}
        </div>
        <h2 className="text-lg font-bold">{data?.name}</h2>

        <button
          onClick={() => handleEditSprint(data)}
          className="rounded p-1 hover:bg-gray-200"
        >
          <Edit className="h-5 w-5 text-gray-800" />
        </button>
      </div>
      <p className="text-muted my-3 text-gray-500">{data?.goal || ""}</p>

      <div className="flex items-center justify-between gap-4 border-gray-200 pb-4">
        <div className="text-sm">
          <div>Duration</div>
          <div className="text-center font-bold">
            {data?.endDate && data?.startDate
              ? formatDistanceToNow(new Date(data?.endDate), {
                  addSuffix: true,
                })
              : ""}
            Days
          </div>
        </div>
        <div className="text-sm">
          <div>Total Project</div>
          <div className="text-center font-bold">3</div>
        </div>

        <div className="text-sm">
          <div>Total Task</div>
          <div className="text-center font-bold">32</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-gray-200 pt-2">
        <button className="hover:bg-gary-200 translate-x-1 rounded bg-gray-200 px-2 py-1 font-medium text-black hover:bg-gray-300">
          Deactivate
        </button>

        <button className="rounded bg-blue-600 px-4 py-1 font-medium text-white hover:bg-blue-700">
          View Details
        </button>
      </div>
    </div>
  );
};

export default SprintCard;
