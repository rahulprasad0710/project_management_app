import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import { IMultiList } from "@/types/user.types";
import { X } from "lucide-react";

type Props = {
  list: IMultiList[];
  selectedList: IMultiList[];
  setSelectList: Dispatch<SetStateAction<IMultiList[]>>;
  placeholder?: string;
  required?: boolean;
  size?: number;
};

const MultiSelect = (props: Props) => {
  const { list, selectedList, setSelectList, placeholder, size } = props;
  const [openSelect, setOpenSelect] = useState<boolean>(false);
  // const [showList, setShowList] = useState<IList[]>([]);
  const multiSelectRef = useRef(null);

  console.log({
    selectedList,
  });

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
      <button
        onClick={() => setOpenSelect(!openSelect)}
        className={`py-${size ?? 2} block w-full rounded border border-gray-200 bg-white px-4 text-left text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none`}
        type="button"
      >
        {selectedList?.length === 0 && (
          <span>{placeholder ? placeholder : "Please select"}</span>
        )}

        {selectedList?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedList?.map((item: IMultiList) => (
              <div
                className="mr-1 flex items-center gap-1 rounded-sm bg-gray-100 px-2 font-semibold text-gray-700"
                key={item.value}
              >
                <span>{item.label}</span>
                <span>
                  <X
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(item.value);
                    }}
                    className="ml-1 h-5 w-5 font-semibold text-gray-700 hover:bg-gray-200 hover:text-red-500"
                  />
                </span>
              </div>
            ))}
          </div>
        )}
      </button>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
      <div
        className={`${openSelect ? "block" : "hidden"} absolute top-full z-50 mt-2 max-h-72 w-full space-y-0.5 overflow-hidden overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2`}
      >
        {list.map((item: IMultiList) => (
          <div
            onClick={() => handleSelect(item.value)}
            key={item.value}
            className="selected focus:outline-hidden w-full cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100"
          >
            <div className="flex items-center">
              {item.icon && (
                <div className="me-2" data-icon="">
                  {item.icon}
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

export default MultiSelect;
