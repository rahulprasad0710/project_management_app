import React, { useMemo, useState } from "react";
import { Response } from "@/store/api";
import { IProject, ITask } from "@/types/user.types";
import { format } from "date-fns";

import {
  Gantt,
  Task,
  EventOption,
  StylingOption,
  ViewMode,
  DisplayOption,
} from "gantt-task-react";
import "gantt-task-react/dist/index.css";

type IProps = {
  projectResponse: Response<IProject> | undefined;
};

const TimelineView = (props: IProps) => {
  const { projectResponse } = props;
  const [displayOption, setDisplayOption] = useState<DisplayOption>({
    viewMode: ViewMode.Day,
    locale: "en-US",
  });

  const ganttTasks: Task[] = useMemo(() => {
    const tasks = projectResponse?.data?.tasks
      ? projectResponse?.data?.tasks?.map((task) => {
          return {
            start: new Date(task.startDate),
            end: new Date(task.endDate),
            name: task.title,
            id: `task-${task.id}`,
            type: "task" as "TaskType",
            progress: 45,
            isDisabled: false,
            styles: {
              progressColor: "#ffbb54",
              progressSelectedColor: "#ff9e0d",
            },
          };
        })
      : ([] as Task[]);

    return tasks;
  }, [projectResponse?.data?.tasks]);
  return (
    <div className="px-4 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-5">
        <h1 className="me-2 text-2xl font-semibold text-gray-800">
          Project Timeline
        </h1>
        <div className="relative inline-block w-64">
          <select
            value={displayOption.viewMode}
            onChange={(e) => {
              setDisplayOption({
                ...displayOption,
                viewMode: e.target.value as ViewMode,
              });
            }}
            className="focus:shadow-outline block w-full appearance-none rounded-sm border border-gray-400 pl-2"
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
            <option value={ViewMode.Year}>Year</option>
          </select>
        </div>
      </div>
      <Gantt
        tasks={ganttTasks}
        // columnWidth={displayOption.viewMode === ViewMode.Month ? 150 : 100}
        {...displayOption}
        listCellWidth="100px"
      />
    </div>
  );
};

export default TimelineView;
