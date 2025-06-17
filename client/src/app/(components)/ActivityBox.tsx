import React from "react";
import { format } from "date-fns";

type ActivityItemProps = {
  avatar: string;
  name: string;
  action: string;
  details?: string;
  post?: string;
  comment?: string;
};

const ActivityBox = () => {
  const activityItems = [
    {
      avatar:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Jese Leos",
      action: "likes Bonnie Green's",
      post: "How to start with Flowbite library",
      details: "I wanted to share a webinar zeroheight.",
      comment: "Thomas Lean's comment",
    },
    {
      avatar:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Neil Sims",
      action: "is requesting access to the Flowbite database.",
      comment: "Thomas Lean's comment",
    },
    {
      avatar:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Bonnie Green",
      action: "react to",
      comment: "Thomas Lean's comment",
    },
    {
      avatar:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Bonnie Green",
      action: "react to",
      comment: "Thomas Lean's comment",
    },
    {
      avatar:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Bonnie Green",
      action: "react to",
      comment: "Thomas Lean's comment",
    },
    {
      avatar:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Bonnie Green",
      action: "react to",
      comment: "Thomas Lean's comment",
    },
  ];

  return (
    <div className="mt-4 max-h-[300px] overflow-y-auto rounded-sm border border-gray-200 p-4">
      {activityItems.map((item: ActivityItemProps, index) => {
        const { comment, name, action, details, post } = item;
        return (
          <div
            key={index}
            className="flex cursor-pointer gap-3 rounded-md p-4 py-4 shadow-sm transition-colors duration-200 hover:bg-gray-100"
          >
            <div className="flex-1 text-sm text-gray-800">
              <p>
                <span className="font-semibold">{name}</span> {action}{" "}
                {comment && <span className="font-semibold">{comment}</span>}
                {post && (
                  <span>
                    post in{" "}
                    <span className="font-semibold text-blue-600">{post}</span>
                  </span>
                )}
              </p>
              {details && (
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  {details}
                </p>
              )}
              <p className="flex w-full justify-end text-xs text-gray-500">
                {format(new Date(), "dd-MM-yyyy hh:mm a")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityBox;
