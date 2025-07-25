import { IInternalCompanyResponse } from "@/types/user.types";
import React from "react";

type Props = {
  data: IInternalCompanyResponse;
  handleEdit: (data: IInternalCompanyResponse) => void;
};

const InternalCompanyCard = ({ data }: Props) => {
  return (
    <div
      key={data.id}
      className="w-full bg-white p-2 pb-12 pt-8 shadow-sm md:p-12"
    >
      <div className="flex justify-between align-top">
        <h2 className="mt-4 text-3xl font-semibold md:mt-10">{data.name}</h2>
        <p className="text-gray-400">Created at : 17th March, 2021</p>
      </div>
      <p>Product Review</p>
      <p className="my-3 text-justify font-medium leading-relaxed text-gray-700">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem aperiam
        nulla cupiditate saepe sed quis veritatis minus rem adipisci aliquid.
      </p>
      <div className="flex items-center justify-end gap-4 border-gray-200 pt-2">
        <button className="mt-2 bg-black p-3 px-5 text-sm font-bold text-white hover:bg-purple-800 md:mt-5">
          Read More
        </button>
      </div>
    </div>
  );
};

export default InternalCompanyCard;
