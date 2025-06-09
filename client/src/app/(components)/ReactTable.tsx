"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type IProps<T> = {
  columns: ColumnDef<T, any>[];
  data: T[];
  showPagination?: boolean;
  handlePrevious: () => void;
  handleNext: () => void;
  isFetching: boolean;
  pagination:
    | {
        currentPage: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
      }
    | undefined;
};

const ReactTable = <T extends object>({
  columns,
  data,
  showPagination,
  handlePrevious,
  handleNext,
  isFetching,
  pagination,
}: IProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!columns || !data) {
    return <div>Error: Missing columns or data</div>;
  }

  const btnClass =
    "inline-flex  items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200";

  return (
    <div className="min-w-full overflow-x-auto rounded-lg border border-neutral-200">
      <div className="max-h-[700px] min-h-[700px] overflow-y-auto overflow-x-hidden">
        <table className="min-w-full table-fixed align-middle text-sm">
          <thead className="sticky top-0 z-10 bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                className="border-b-2 border-neutral-100"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <th
                    className="min-w-[140px] px-3 py-3 text-start text-sm font-semibold uppercase tracking-wider text-neutral-700"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {isFetching || data?.length === 0
              ? Array.from({ length: 10 }).map((_, index) => (
                  <tr
                    key={`skeleton-${index}`}
                    className="animate-pulse border-b border-neutral-100"
                  >
                    {table.getAllColumns().map((col, colIndex) => (
                      <td
                        key={`skeleton-td-${colIndex}`}
                        className="p-6 text-start font-semibold text-neutral-600"
                      >
                        <div className="h-4 w-full rounded bg-neutral-200"></div>
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.map((row) => (
                  <tr
                    className="border-b border-neutral-100 hover:bg-neutral-50"
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        className="p-3 text-start font-semibold text-neutral-600"
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between border-t border-neutral-200 bg-white">
          <div className="flex items-center justify-between px-4 py-4">
            <p className="mr-4">Total : {table.getRowModel().rows.length}</p>
            <p className="text-sm text-gray-700">
              Showing
              <span className="mx-1 px-1 font-medium">1</span>
              to
              <span className="mx-1 px-1 font-medium">10</span>
              of
              <span className="mx-1 px-1 font-medium">97</span>
              results
            </p>
          </div>
          <nav className="flex items-center justify-between gap-6 px-4 py-2">
            <button
              disabled={pagination?.currentPage === 1}
              onClick={() => handlePrevious()}
              className={
                pagination?.currentPage === 1
                  ? `${btnClass} cursor-not-allowed bg-neutral-100 text-neutral-500 opacity-60`
                  : `${btnClass} cursor-pointer`
              }
            >
              <span>Previous</span>
            </button>
            <button className={btnClass} onClick={() => handleNext()}>
              <span>Next</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ReactTable;
