import React, { useState } from "react";

import CommentBox from "./CommentBox";
import LatestActivity from "./dashboard/Activity";
import PriorityTag from "./molecules/PriorityTag";

type Props = {};

type TAB_TYPES = "ACTIVITY" | "COMMENTS";

const TaskDetails = (props: Props) => {
  const [activeTab, setActiveTab] = useState<TAB_TYPES>("COMMENTS");

  return (
    <div className="flex max-h-[600px] flex-col gap-4 overflow-y-scroll px-4 md:flex-row">
      <div className="flex-1 space-y-4">
        {/* <div className="text-sm text-gray-500">/ SIMSV2-4182</div> */}
        <h1 className="text-2xl font-semibold">
          Rate Limit Issue in the Backend
        </h1>

        <div className="mt-4">
          <h2 className="text-lg font-medium">Description</h2>
          <p className="mt-1 text-sm text-gray-700">
            Rate Limit Issue in the Backend
          </p>
          <p className="mt-1 text-sm text-gray-500">Environment: None</p>
        </div>

        <div className="mt-6">
          <div className="mt-2 flex gap-2 rounded-md border border-gray-200 p-1">
            <button
              onClick={() => setActiveTab("ACTIVITY")}
              className={
                activeTab === "ACTIVITY"
                  ? "rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-200"
                  : "rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
              }
            >
              Activities
            </button>
            <button
              onClick={() => setActiveTab("COMMENTS")}
              className={
                activeTab === "COMMENTS"
                  ? "rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-200"
                  : "rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
              }
            >
              Comments
            </button>
          </div>
          <div className="mt-2">
            {" "}
            {activeTab === "ACTIVITY" && <LatestActivity />}
            {activeTab === "COMMENTS" && <CommentBox />}
          </div>
        </div>
      </div>
      <div className="w-full space-y-4 md:w-80">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">To Do</div>
          <span className="text-gray-500">⚡</span>
        </div>

        <div className="rounded-sm border bg-white p-4 shadow-sm">
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Assignee:</span> Rahul Prasad
            </div>
            <div>
              <span className="font-semibold">Reporter:</span> Rahul Prasad
            </div>
            {/* <div className="cursor-pointer text-blue-600">
              Open with Atlassian...
            </div> */}
            {/* <div className="cursor-pointer text-blue-600">Create branch</div>
            <div className="cursor-pointer text-blue-600">Create commit</div> */}
            <div className="my-2 border-t border-gray-200"></div>
            <div>
              <span className="font-semibold">Labels:</span> None
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold">Priority:</span>
              <PriorityTag priority="HIGH" />
            </div>
            <div className="my-2 border-t border-gray-200"></div>
            <div className="text-gray-500">Created May 19, 2025 at 1:53 PM</div>
            <div className="text-gray-500">Updated May 28, 2025 at 2:50 PM</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
