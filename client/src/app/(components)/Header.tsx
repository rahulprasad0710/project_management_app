import React from "react";

type Props = {
  title: string;
  buttonComponent?: React.ReactNode;
  showBtn: boolean;
  isSmallText?: boolean;
};

const Header = (props: Props) => {
  const { title, buttonComponent, isSmallText = false, showBtn } = props;
  return (
    <div className="flex w-full items-center justify-between">
      {isSmallText ? (
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      ) : (
        <h1 className="text-3xl font-semibold text-gray-800">{title}</h1>
      )}
      {showBtn && buttonComponent}
    </div>
  );
};

export default Header;
