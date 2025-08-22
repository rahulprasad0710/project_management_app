import React from "react";

type TProps = {
    btnList?: {
        btnText: string;
        id: string;
        disabled?: boolean;
        key: string;
        roomNumber: string;
        handleClick?: (
            roomTypeId: string,
            key: string,
            roomNumber: string
        ) => void;
    }[];
    isBtnPresent: boolean;
    children: React.ReactNode;
    selectedRoomNumberList: string[];
};

const ButtonGroup2 = (props: TProps) => {
    const { btnList, isBtnPresent, children, selectedRoomNumberList } = props;

    const classNameFirst =
        "inline-flex items-center gap-2 bg-transparent px-4 py-3 text-sm font-medium text-gray-800 ring-1 ring-inset ring-gray-300 transition first:rounded-l-lg last:rounded-r-lg hover:bg-gray-50 dark:bg-white/[0.03] dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-white/[0.03]";
    const classNameMiddle =
        "-ml-px inline-flex items-center gap-2 bg-transparent px-4 py-3 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition first:rounded-l-lg last:rounded-r-lg hover:bg-gray-50 hover:text-gray-800 dark:bg-transparent dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]";

    const classNameLast =
        "-ml-px inline-flex items-center gap-2 bg-transparent px-4 py-3 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition first:rounded-l-lg last:rounded-r-lg hover:bg-gray-50 hover:text-gray-800 dark:bg-transparent dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]";

    const getClassName = (index: number, ItemIndex: number) => {
        let itemIndex = undefined;

        if (index === 0) {
            itemIndex = "FIRST";
        } else if (index === ItemIndex - 1) {
            itemIndex = "LAST";
        } else {
            itemIndex = "MIDDLE";
        }

        switch (itemIndex) {
            case "FIRST":
                return classNameFirst;
            case "LAST":
                return classNameLast;

            default:
                return classNameMiddle;
        }
    };

    return (
        <div className='inline-flex items-center shadow-theme-xs'>
            {isBtnPresent &&
                btnList?.map((item, index) => (
                    <button
                        key={item.id}
                        type='button'
                        className={`${getClassName(index, btnList.length)} ${
                            selectedRoomNumberList.includes(item.id) &&
                            !item.disabled
                                ? "bg-green-500! text-white! "
                                : ""
                        }  ${
                            item.disabled
                                ? "bg-gray-100! text-gray-300! cursor-not-allowed "
                                : ""
                        } `}
                        disabled={item.disabled}
                        onClick={() =>
                            item.handleClick?.(
                                item.key,
                                item.id,
                                item.roomNumber
                            )
                        }
                    >
                        {item.btnText}
                    </button>
                ))}

            {!isBtnPresent && children}
        </div>
    );
};

export default ButtonGroup2;
