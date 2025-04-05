import React from "react";
import Image from "next/image";

type ProjectCardProps = {
  name: string;
  role: string;
  teamMember: number;
  comments: number;
};
const ProjectCard = (props: ProjectCardProps) => {
  return (
    <div className="flex gap-6">
      <div className="w-1/4 rounded-md border border-white bg-white p-4 shadow-md">
        <div className="flex-none sm:flex">
          <div className="flex-auto justify-evenly sm:ml-5">
            <div className="flex items-center justify-between sm:mt-2">
              <div className="flex items-center">
                <div className="flex flex-col">
                  <div className="w-full flex-none text-lg font-bold leading-none text-gray-800">
                    Aji
                  </div>
                  <div className="my-1 flex-auto text-gray-500">
                    <span className="mr-3">UI/UX Designer</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex pt-2 text-sm text-gray-500">
              <div className="inline-flex flex-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                </svg>
                <p className="">1.2k Followers</p>
              </div>
              <div className="inline-flex flex-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="">14 Components</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
