import { Grid3X3, Search } from "lucide-react";

import React from "react";

type IProps = {
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBar = (props: IProps) => {
  const { keyword, setKeyword } = props;
  return (
    <div className="relative">
      <Search className="absolute right-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer" />
      <input
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        type="text"
        placeholder="Search..."
        className="rounded-sm border py-1 pl-10 pr-4 focus:border-blue-300 focus:bg-white focus:outline-none"
      />

      <Grid3X3 className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
    </div>
  );
};

export default SearchBar;
