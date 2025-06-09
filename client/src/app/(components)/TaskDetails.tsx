import PriorityTag from "./molecules/PriorityTag";
import React from "react";

type Props = {};

const TaskDetails = (props: Props) => {
  return (
    <div className="flex flex-col gap-4 px-4 md:flex-row">
      <div className="flex-1 space-y-4">
        <div className="text-sm text-gray-500">/ SIMSV2-4182</div>
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

        <Tabs defaultValue="comments" className="mt-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="worklog">Work log</TabsTrigger>
          </TabsList>
        </Tabs>
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
            <div className="cursor-pointer text-blue-600">
              Open with Atlassian...
            </div>
            <div className="cursor-pointer text-blue-600">Create branch</div>
            <div className="cursor-pointer text-blue-600">Create commit</div>
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

export const Tabs: React.FC<{
  children: React.ReactNode;
  defaultValue: string;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={"" + className}>{children}</div>
);

export const TabsList: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="mt-2 flex gap-2">{children}</div>;

export const TabsTrigger: React.FC<{
  children: React.ReactNode;
  value: string;
}> = ({ children }) => (
  <button className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200">
    {children}
  </button>
);

export default TaskDetails;
