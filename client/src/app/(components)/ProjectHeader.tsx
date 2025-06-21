import { Clock, Table } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

type BOARD_TYPES = "BOARD" | "LIST" | "CALENDAR" | "TIMELINE" | "TABLE";

type IProps = {
  activeTab: BOARD_TYPES;
  setActiveTab: Dispatch<SetStateAction<BOARD_TYPES>>;
};

type TabButtonProps = {
  tabTittle: BOARD_TYPES;
  activeTab: BOARD_TYPES;
  icon: React.ReactNode;
  setActiveTab: (tabName: BOARD_TYPES) => void;
};

const TabButton = ({
  tabTittle,
  activeTab,
  icon,
  setActiveTab,
}: TabButtonProps) => {
  const isActive = activeTab === tabTittle;

  const handleClick = (tittle: BOARD_TYPES) => {
    setActiveTab(tittle);
  };

  return (
    <button
      onClick={() => handleClick(tabTittle)}
      className={`lg-px-4 relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[5px] after:left-0 after:h-[2px] after:w-full hover:text-blue-600 sm:px-2 ${isActive ? "text-blue-600 after:bg-blue-600" : ""}`}
    >
      {icon}
      {tabTittle}
    </button>
  );
};

const ProjectHeader = ({ activeTab, setActiveTab }: IProps) => {
  return (
    <div className="flex flex-1 items-center gap-2 md:gap-4">
      <TabButton
        tabTittle="TIMELINE"
        activeTab={activeTab}
        icon={<Clock className="h-5 w-5" />}
        setActiveTab={setActiveTab}
      />
      <TabButton
        tabTittle="TABLE"
        activeTab={activeTab}
        icon={<Table className="h-5 w-5" />}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default ProjectHeader;
