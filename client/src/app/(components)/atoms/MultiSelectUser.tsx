import { ChevronDown, User, X } from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import { IMultiList } from "@/types/user.types";
import Image from "next/image";

type Props = {
  list: IMultiList[];
  selectedList: IMultiList[];
  setSelectList: Dispatch<SetStateAction<IMultiList[]>>;
  placeholder?: string;
  required?: boolean;
  size?: number;
};

const MultiSelectUser = (props: Props) => {
  const { list, selectedList, setSelectList, placeholder, size } = props;
  const [openSelect, setOpenSelect] = useState<boolean>(false);
  // const [showList, setShowList] = useState<IList[]>([]);
  const multiSelectRef = useRef(null);

  const handleSelect = (valueSelected: number | string) => {
    const isItemAlreadyPresent = selectedList.find(
      (item) => item.value === valueSelected,
    );

    if (isItemAlreadyPresent) {
      const temp = selectedList.filter((item) => item.value !== valueSelected);
      setSelectList(temp);
    } else {
      const temp = list.find((item) => item.value === valueSelected);

      if (temp) {
        setSelectList([...selectedList, temp]);
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        multiSelectRef.current &&
        !multiSelectRef?.current?.contains(event.target)
      ) {
        setOpenSelect(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={multiSelectRef} className="multi-select-box relative">
      <div
        onClick={() => setOpenSelect(!openSelect)}
        className={`flex min-w-[200px] ${selectedList?.length > 0 ? "justify-end" : "justify-end"} gap-4 rounded bg-white p-1`}
      >
        {selectedList?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedList?.map((item: IMultiList) => (
              <div className="" key={item.value}>
                {item?.icon ? (
                  <button
                    className="rounded-full bg-gray-200 p-1 font-semibold text-gray-700 shadow-[0_0_0_1px_#60a5fa] hover:text-red-500 hover:shadow-[0_0_0_1px_#16a34a,0_0_0_4px_white,0_0_0_6px_#16a34a]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(item.value);
                    }}
                  >
                    <Image
                      src={item?.icon}
                      alt={item?.label}
                      title={item?.label}
                      width={20}
                      height={20}
                      className="flex items-center justify-center rounded-full bg-gray-200"
                    />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(item.value);
                    }}
                    title={item?.label}
                    className="rounded-full bg-gray-200 p-1 font-semibold text-gray-700 shadow-[0_0_0_1px_#60a5fa] hover:text-red-500 hover:shadow-[0_0_0_1px_#16a34a,0_0_0_4px_white,0_0_0_6px_#16a34a]"
                  >
                    <User className="h-5 w-5 text-gray-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-end gap-2">
          <div className="bg-grey-100 cursor-pointer rounded border border-gray-600 p-1 text-sm font-semibold text-gray-800">
            {selectedList?.length}/{list?.length}
          </div>
          {/* <button
            onClick={() => setOpenSelect(!openSelect)}
            className="text-gray-700 hover:text-gray-800 focus:border-blue-300 focus:bg-white focus:outline-none"
          >
            <ChevronDown className="h-5 w-5" />
          </button> */}
        </div>
      </div>

      <div
        className={`${openSelect ? "block" : "hidden"} absolute top-full z-50 mt-2 max-h-72 w-full min-w-[200px] space-y-0.5 overflow-hidden overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2`}
      >
        {list.map((item: IMultiList) => (
          <div
            onClick={() => handleSelect(item.value)}
            key={item.value}
            className="selected focus:outline-hidden w-full min-w-[200px] cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100"
          >
            <div className="flex items-center">
              {item.icon && (
                <div className="me-2">
                  <Image src={item.icon} alt="icon" width={20} height={20} />
                </div>
              )}
              <div
                className={
                  selectedList.find(
                    (selectedItem) => selectedItem.value === item.value,
                  )
                    ? "text-md font-semibold text-gray-800"
                    : "text-md text-gray-800"
                }
                data-title=""
              >
                {item.label}
              </div>
              <div className="ms-auto">
                <span
                  className={
                    selectedList.find(
                      (selectedItem) => selectedItem.value === item.value,
                    )
                      ? "block"
                      : "hidden"
                  }
                >
                  <svg
                    className="size-4 shrink-0 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectUser;
