import type { Dispatch, SetStateAction } from "react";

import React from "react";

interface SwitchProps {
    label: string;
    selectedChecked: boolean;
    setSelectedChecked: Dispatch<SetStateAction<boolean>>;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    color?: "blue" | "gray";
}

const CheckSwitch: React.FC<SwitchProps> = ({
    label,
    selectedChecked,
    disabled = false,
    setSelectedChecked,
    onChange,
    color = "blue",
}) => {
    const handleToggle = () => {
        if (disabled) return;
        const newCheckedState = !selectedChecked;
        setSelectedChecked(newCheckedState);
        if (onChange) {
            onChange(newCheckedState);
        }
    };

    const switchColors =
        color === "blue"
            ? {
                  background: selectedChecked
                      ? "bg-teal-500 "
                      : "bg-gray-200 dark:bg-white/10", // Blue version
                  knob: selectedChecked
                      ? "translate-x-full bg-white"
                      : "translate-x-0 bg-white",
              }
            : {
                  background: selectedChecked
                      ? "bg-gray-800 dark:bg-white/10"
                      : "bg-gray-200 dark:bg-white/10", // Gray version
                  knob: selectedChecked
                      ? "translate-x-full bg-white"
                      : "translate-x-0 bg-white",
              };

    return (
        <label
            className={`flex cursor-pointer select-none items-center gap-3 text-sm font-medium ${
                disabled ? "text-gray-400" : "text-gray-700 dark:text-gray-400"
            }`}
            onClick={handleToggle}
        >
            <div className='relative'>
                <div
                    className={`block transition duration-150 ease-linear h-6 w-11 rounded-full ${
                        disabled
                            ? "bg-gray-100 pointer-events-none dark:bg-gray-800"
                            : switchColors.background
                    }`}
                ></div>
                <div
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-theme-sm duration-150 ease-linear transform ${switchColors.knob}`}
                ></div>
            </div>
            {label}
        </label>
    );
};

export default CheckSwitch;
