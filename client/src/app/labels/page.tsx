"use client";

import { ILabelResponse, ISprintResponse } from "@/types/user.types";
import React, { useEffect, useState } from "react";
import { SquarePen, SquarePlus } from "lucide-react";

import Header from "@/app/(components)/Header";
import Modal from "@/app/(components)/Modal";
import ReactTable from "../(components)/ReactTable";
import SearchBar from "@/app/(components)/molecules/SearchBar";
import SprintModal from "@/app/(components)/modals/SprintModal";
import { createColumnHelper } from "@tanstack/react-table";
import { useLazyGetLabelsQuery } from "@/store/api";

const LabelList = () => {
  const [isSprintActive, setIsSprintActive] = useState<boolean>(true);
  const [fetchAllLabels, { isFetching, data }] = useLazyGetLabelsQuery();

  useEffect(() => {
    fetchAllLabels({
      isPaginationEnabled: true,
      page: data?.data?.pagination?.currentPage
        ? data?.data?.pagination?.currentPage - 1
        : 1,
      pageSize: data?.data?.pagination?.pageSize,
      keyword: keyword,
      isActive: isSprintActive,
    });
  }, [isSprintActive]);

  const [toggle, setToggle] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<
    undefined | ISprintResponse
  >();
  const [keyword, setKeyword] = useState<string>("");

  const handleToggleModal = () => {
    setToggle(!toggle);
  };

  const handleEdit = (data: ILabelResponse) => {
    setSelectedData(data);
    setToggle(true);
  };
  const columnHelper = createColumnHelper<ILabelResponse>();

  const columns = [
    columnHelper.accessor((row) => row.name, {
      id: "name",
      cell: (info) => <i>{info.renderValue()}</i>,
      header: () => <span>Title</span>,
    }),
    columnHelper.accessor((row) => row.description, {
      id: "Status",
      cell: (info) => <div>{info.renderValue()}</div>,
      header: () => <span>Description</span>,
    }),
    columnHelper.accessor((row) => row.isActive, {
      id: "Status",
      cell: (info) => (
        <div>
          {info.renderValue() ? (
            <div className="inline-flex rounded-full bg-green-100 px-2 text-sm font-semibold leading-5 text-green-800">
              Active
            </div>
          ) : (
            <div className="inline-flex rounded-full bg-red-100 px-2 text-sm font-semibold leading-5 text-red-800">
              Inactive
            </div>
          )}
        </div>
      ),
      header: () => <span>Status</span>,
    }),

    columnHelper.accessor((row) => row, {
      id: "action",
      cell: (info) => (
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleEdit(info.row.original)}
            title="edit"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
          >
            <span>Edit</span>
            <SquarePen className="h-5 w-5 text-blue-400" />
          </button>
        </div>
      ),
      header: () => <span>Action</span>,
    }),
  ];

  const handlePrevious = () => {
    if (
      !data?.data?.pagination?.currentPage ||
      data?.data?.pagination?.currentPage === 1
    )
      return;

    fetchAllLabels({
      isPaginationEnabled: true,
      page: data?.data?.pagination?.currentPage - 1,
      pageSize: data?.data?.pagination?.pageSize,
      keyword: keyword,
      isActive: isSprintActive,
    });
  };

  const handleNext = () => {
    if (!data?.data?.pagination?.currentPage) return;

    fetchAllLabels(
      {
        isPaginationEnabled: true,
        page: data?.data?.pagination?.currentPage + 1,
        pageSize: data?.data?.pagination?.pageSize,
        keyword: keyword,
        isActive: isSprintActive,
      },
      true,
    );
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 lg:pt-2 xl:max-w-7xl">
      <div className="flex items-center justify-between pb-4 pt-4 lg:pb-4">
        <Header title="Labels" />

        <div className="flex justify-end gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="mt-2 flex gap-2 rounded-md border border-gray-200 p-1">
              <button
                onClick={() => setIsSprintActive(true)}
                className={
                  isSprintActive === true
                    ? "rounded bg-green-400 px-3 py-1 text-sm hover:bg-gray-200"
                    : "rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                }
              >
                Active
              </button>
              <button
                onClick={() => setIsSprintActive(false)}
                className={
                  isSprintActive === false
                    ? "rounded bg-red-400 px-3 py-1 text-sm hover:bg-gray-200"
                    : "rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                }
              >
                Inactive
              </button>
            </div>
            <SearchBar setKeyword={setKeyword} keyword={keyword} />
          </div>

          <button
            onClick={handleToggleModal}
            className="flex items-center rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            <span>
              <SquarePlus className="mr-3 h-5 w-5" />
            </span>
            <span>Add new label</span>
          </button>
        </div>
      </div>
      <div>
        <div className="pb-5">
          <ReactTable
            isFetching={isFetching}
            showPagination
            columns={columns}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            data={data?.data.result ?? []}
            pagination={data?.data.pagination}
          />
        </div>
      </div>
      <Modal
        isOpen={toggle}
        size={2}
        onClose={() => setToggle(false)}
        modalTitleChildren={
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedData?.id ? "Edit Sprint" : "Add Sprint"}
            </h2>
          </div>
        }
      >
        <SprintModal
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          onClose={() => setToggle(false)}
        />
      </Modal>
    </div>
  );
};

export default LabelList;
