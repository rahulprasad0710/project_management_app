import { ActivityAction, IActivityResponse, IUser } from "@/types/user.types";
import React, { useEffect } from "react";

import CreatePost from "./molecules/CreatePost";
import { format } from "date-fns";
import { useLazyGetActivityByTaskIdQuery } from "@/store/api";

const ActivityBox = () => {
  const [fetchActivityByTaskId, { data }] = useLazyGetActivityByTaskIdQuery();

  useEffect(() => {
    fetchActivityByTaskId({ taskId: 38 });
  }, []);

  return (
    <div className="mt-4 max-h-[300px] overflow-y-auto rounded-sm border border-gray-200 p-4">
      {data?.data.map((item) => {
        return (
          <div
            key={item.id}
            className="rounded-md p-2 shadow-sm transition-colors duration-200 hover:bg-gray-100"
          >
            <CreatePost item={item} />
            <p className="flex w-full justify-end text-xs text-gray-500">
              {format(item.createdAt ?? new Date(), "dd-MM-yyyy hh:mm a")}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityBox;

{
  /* <p>
  <span className="font-semibold">{name}</span> {action}{" "}
  {comment && <span className="font-semibold">{comment}</span>}
  {post && (
    <span>
      post in <span className="font-semibold text-blue-600">{post}</span>
    </span>
  )}
</p>;
{
  details && <p className="mt-1 text-gray-600 dark:text-gray-400">{details}</p>;
} */
}
