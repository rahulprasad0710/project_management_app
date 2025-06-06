import React from "react";

type Props = {};

const NotificationDropDown = (props: Props) => {
  return (
    <div
      aria-labelledby="dropdown-notifications"
      className="absolute -end-20 z-10 mt-2 w-64 rounded-lg shadow-xl lg:w-80 ltr:origin-top-right rtl:origin-top-left"
    >
      <div className="rounded-lg bg-white py-2.5 ring-1 ring-black/5">
        <a
          role="menuitem"
          href="javascript:void(0)"
          className="group block gap-1.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
        >
          <div className="text-xs text-neutral-600">Just now</div>
          <h5 className="mb-0.5 font-semibold">
            <span className="text-indigo-500">&bull;</span>
            New Ticket Assigned: #4567
          </h5>
          <p className="text-xs text-neutral-500">
            You have been assigned a new ticket regarding a software
            installation issue. Please review and respond promptly.
          </p>
        </a>
        <a
          role="menuitem"
          href="javascript:void(0)"
          className="group block gap-1.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
        >
          <div className="text-xs text-neutral-600">2 hours ago</div>
          <h5 className="mb-0.5 font-semibold">
            <span className="text-indigo-500">&bull;</span>
            Feedback Requested for Ticket #4432
          </h5>
          <p className="text-xs text-neutral-500">
            Your recently resolved ticket regarding account recovery has been
            flagged for quality review. Please provide your feedback.
          </p>
        </a>

        <a
          role="menuitem"
          href="javascript:void(0)"
          className="group block gap-1.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
        >
          <div className="text-xs text-neutral-600">5 hours ago</div>
          <h5 className="mb-0.5 font-semibold">
            <span className="text-indigo-500">&bull;</span>
            Monthly Performance Metrics Available
          </h5>
          <p className="text-xs text-neutral-500">
            Your support performance metrics for the past month are now
            available. Review them for insights on response times and customer
            satisfaction.
          </p>
        </a>
        <hr className="my-2.5 border-neutral-100" />
        <div className="px-4 py-1.5">
          <a
            href="javascript:void(0)"
            className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-sm font-semibold leading-5 text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
          >
            <svg
              className="hi-mini hi-bell-alert inline-block size-4 opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M4.214 3.227a.75.75 0 00-1.156-.956 8.97 8.97 0 00-1.856 3.826.75.75 0 001.466.316 7.47 7.47 0 011.546-3.186zM16.942 2.271a.75.75 0 00-1.157.956 7.47 7.47 0 011.547 3.186.75.75 0 001.466-.316 8.971 8.971 0 00-1.856-3.826z" />
              <path
                fill-rule="evenodd"
                d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.94 32.94 0 003.256.508 3.5 3.5 0 006.972 0 32.933 32.933 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zm0 14.5a2 2 0 01-1.95-1.557 33.54 33.54 0 003.9 0A2 2 0 0110 16.5z"
                clip-rule="evenodd"
              />
            </svg>
            <span>All notifications</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropDown;
