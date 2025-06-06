import React from "react";

type Props = {
  title: string;
  buttonComponent?: React.ReactNode;
  isSmallText?: boolean;
};

const Header = (props: Props) => {
  const { title, isSmallText = false } = props;
  return (
    <div>
      {isSmallText ? (
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      ) : (
        <h1 className="text-3xl font-semibold text-gray-800">{title}</h1>
      )}
    </div>
  );
};

export default Header;
