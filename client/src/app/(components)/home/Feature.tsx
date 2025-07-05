"use client";

import React, { useState } from "react";

const Feature = () => {
  const [selectedFeature, setSelectedFeature] = useState(1);

  const features = [
    {
      title: "Project Management",
      points: [
        "Create Projects with metadata",
        "Project Dashboard for real-time tracking",
        "Project & Productivity Reports",
      ],
    },
    {
      title: "Task & Workflow",
      points: [
        "Kanban Task Boards",
        "Task details with subtasks & recurring logic",
        "Reminders via Email/In-App",
      ],
    },
    {
      title: "Communication & Collaboration",
      points: [
        "Chat integration per task/project",
        "Schedule meetings easily",
        "Activity Log: Who did what, when",
      ],
    },

    {
      title: "User & Team Management",
      points: [
        "Manage Teams & Departments",
        "Set Roles ,Access and permissions",
        "Schedule meetings easily",
      ],
    },
  ];
  return (
    <div className="bg-gradient-to-r from-blue-600 to-teal-500 py-24 text-center text-white">
      <h2 className="font-display mb-12 text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
        Everything you need to run your books.
      </h2>
      <div className="grid grid-cols-2 gap-8">
        <div className="grid grid-cols-2 gap-8 rounded px-4 py-6">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => setSelectedFeature(index)}
              className={`lg:hover:bg-white/5" relative z-10 flex cursor-pointer gap-x-4 whitespace-nowrap px-4 transition-all hover:bg-white/10 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal ${selectedFeature === index ? "bg-white/10" : ""}`}
              role="tablist"
              aria-orientation="vertical"
            >
              <div className="group relative rounded-full px-6 py-4 lg:rounded-l-xl lg:rounded-r-none lg:p-6">
                <h3>
                  <div className="font-display mb-4 text-left text-xl font-semibold text-blue-100 hover:text-white lg:text-white">
                    <span className="inset-0 rounded-full text-left lg:rounded-l-xl lg:rounded-r-none" />
                    {feature.title}
                  </div>
                </h3>
                <ul className="list-inside list-disc space-y-1 text-left text-sm text-white">
                  {feature.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded p-4">Column Index : {selectedFeature}</div>
      </div>
    </div>
  );
};

export default Feature;
