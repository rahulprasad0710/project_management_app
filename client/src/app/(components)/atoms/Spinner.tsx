// components/Spinner.tsx
import React from "react";
import classNames from "classnames";

type SpinnerProps = {
  size?: "sm" | "md" | "lg" | number; // You can pass string or pixel number
};

export const Spinner: React.FC<SpinnerProps> = ({ size = "md" }) => {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };

  const dynamicSize =
    typeof size === "number" ? { height: size, width: size } : undefined;

  return (
    <div className="flex items-center justify-center">
      <div
        className={classNames(
          "animate-spin rounded-full border-4 border-blue-500 border-t-transparent",
          typeof size === "string" ? sizeClass[size] : "",
        )}
        style={dynamicSize}
      />
    </div>
  );
};
