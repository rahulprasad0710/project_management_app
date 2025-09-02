"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import type { ColumnDef } from "@tanstack/react-table";

type IProps<T> = {
    columns: ColumnDef<T, any>[];
    data: T[];
    showPagination?: boolean;
    handlePrevious?: () => void;
    handleNext?: () => void;
    isFetching: boolean;
    pagination?: {
        currentPage: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
    };
};

const ReactTable = <T extends object>({
    columns,
    data,
    showPagination = true,
    handlePrevious = () => {},
    handleNext = () => {},
    isFetching,
    pagination = {
        currentPage: 1,
        pageSize: 10,
        totalCount: data?.length ?? 0,
        totalPages: 1,
    },
}: IProps<T>) => {
    console.log({
        pagination,
    });
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (!columns || !data) {
        return <div>Error: Missing columns or data</div>;
    }

    const lastIndex = () => {
        let lastCount = 0;
        let hasNextPage = true;

        const lastIndex =
            (pagination?.currentPage - 1) * pagination?.pageSize +
            pagination?.pageSize;
        const totalCount = pagination?.totalCount;
        if (lastIndex > totalCount) {
            lastCount = totalCount;
            hasNextPage = false;
            return { lastCount, hasNextPage };
        } else {
            lastCount = lastIndex;
            hasNextPage = true;
            return { lastCount, hasNextPage };
        }
    };

    const btnClass =
        "inline-flex  items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200";

    return (
        <div className='overflow-hidden rounded-md border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-slate-800'>
            <div className='max-h-[700px]  overflow-y-auto overflow-x-hidden'>
                <table className='min-w-full table-fixed align-middle text-sm'>
                    <thead className='border-b border-gray-100 dark:border-white/[0.05]'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr
                                className='border-b-2 border-neutral-100'
                                key={headerGroup.id}
                            >
                                {headerGroup.headers.map((header) => (
                                    <th
                                        className='min-w-[140px]  px-5 py-3 font-semibold text-gray-600 text-start text-theme-sm dark:text-gray-400'
                                        key={header.id}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
                        {isFetching
                            ? Array.from({ length: 10 }).map((_, index) => (
                                  <tr
                                      key={`skeleton-${index}`}
                                      className='animate-pulse border-b border-neutral-100'
                                  >
                                      {table
                                          .getAllColumns()
                                          .map((col, colIndex) => (
                                              <td
                                                  key={`skeleton-td-${colIndex}`}
                                                  className='p-6 text-start font-semibold  text-gray-700 dark:text-slate-100'
                                              >
                                                  <div className='h-4 w-full rounded bg-neutral-200'></div>
                                              </td>
                                          ))}
                                  </tr>
                              ))
                            : table.getRowModel().rows.map((row) => (
                                  <tr
                                      className='border-b border-neutral-100 hover:bg-neutral-50'
                                      key={row.id}
                                  >
                                      {row.getVisibleCells().map((cell) => (
                                          <td
                                              className='p-3 text-start font-semibold text-gray-700 dark:text-slate-100 '
                                              key={cell.id}
                                          >
                                              {flexRender(
                                                  cell.column.columnDef.cell,
                                                  cell.getContext()
                                              )}
                                          </td>
                                      ))}
                                  </tr>
                              ))}
                    </tbody>
                </table>
            </div>

            {!isFetching && pagination?.totalCount === 0 && (
                <div className='flex items-center w-full  bg-white  px-6 py-4 dark:border-gray-800 dark:bg-slate-800'>
                    <div className='text-center w-full text-gray-600'>
                        No Data Found.
                    </div>
                </div>
            )}
            {showPagination && (
                <div className='flex items-center w-full justify-between bg-white border-t border-gray-200 px-6 py-4 dark:border-gray-800 dark:bg-slate-800'>
                    <div className='flex items-center justify-between '>
                        <p className='mr-4 text-sm text-gray-700 dark:text-slate-100'>
                            Total pages :
                            <span className='mx-1 px-1 font-medium'>
                                {pagination?.totalPages}
                            </span>
                        </p>
                        <p className='text-sm text-gray-700 dark:text-slate-100'>
                            Showing
                            <span className='mx-1 px-1 font-medium'>
                                {pagination?.pageSize *
                                    (pagination?.currentPage - 1) +
                                    1}
                            </span>
                            to
                            <span className='mx-1 px-1 font-medium'>
                                {lastIndex().lastCount}
                            </span>
                            of
                            <span className='mx-1 px-1 font-medium'>
                                {String(pagination?.totalCount)}
                            </span>
                            results
                        </p>
                    </div>
                    <nav className='flex items-center justify-between gap-6 '>
                        <button
                            disabled={pagination?.currentPage === 1}
                            onClick={() => handlePrevious()}
                            className={
                                pagination?.currentPage === 1
                                    ? `${btnClass} cursor-not-allowed bg-neutral-100 text-neutral-500 opacity-60`
                                    : `${btnClass} cursor-pointer`
                            }
                        >
                            <ChevronLeft className='h-5 w-5' />

                            <span>Previous</span>
                        </button>
                        <button
                            disabled={!lastIndex().hasNextPage}
                            className={
                                !lastIndex().hasNextPage
                                    ? `${btnClass} cursor-not-allowed bg-neutral-100 text-neutral-500 opacity-60`
                                    : `${btnClass} cursor-pointer`
                            }
                            onClick={() => handleNext?.()}
                        >
                            <span>Next</span>
                            <ChevronRight className='h-5 w-5' />
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default ReactTable;
