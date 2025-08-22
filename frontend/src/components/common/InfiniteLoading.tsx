import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    LazyQueryTrigger,
    QueryDefinition,
} from "@reduxjs/toolkit/query/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import DropDownArrow from "../atoms/DropDownArrow";
import type { ResponseWithPagination } from "@/types/config.types";
import type { SerializedError } from "@reduxjs/toolkit";
import { Spinner } from "../atoms/Spinner";
import Spinner2 from "../atoms/Spinner2";
import { X } from "lucide-react";

export interface Pagination {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface GenericApiResponse<T> {
    data: {
        result: T[];
        pagination: Pagination;
    };
}

interface InfiniteScrollSelectProps<T> {
    fetchAll: LazyQueryTrigger<
        QueryDefinition<
            Pagination,
            BaseQueryFn<
                string | FetchArgs,
                unknown,
                FetchBaseQueryError | SerializedError
            >,
            string,
            ResponseWithPagination<T>,
            "api"
        >
    >;
    getOptionLabel: (item: T) => string;
    getOptionValue: (item: T) => string | number;
    preselectedValue?: T;
    onSelect?: (value: T | undefined) => void;
    placeholder: string;
    isSelectDisabled?: boolean;
}

export default function InfiniteScrollSelect<T>({
    fetchAll,
    getOptionLabel,
    getOptionValue,
    preselectedValue,
    onSelect,
    placeholder,
    isSelectDisabled = false,
}: InfiniteScrollSelectProps<T>) {
    const [items, setItems] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [selected, setSelected] = useState<T | undefined>(preselectedValue);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const observerRef = useRef<HTMLDivElement | null>(null);

    const loadData = useCallback(
        async (reset = false, searchTerm = keyword) => {
            if (loading) return;
            setLoading(true);

            try {
                const res = await fetchAll({
                    isPaginationEnabled: true,
                    page: reset ? 1 : page,
                    pageSize: 10,
                    keyword: searchTerm || "",
                }).unwrap();

                const newItems = res.data.result;
                setHasMore((reset ? 1 : page) < res.data.pagination.totalPages);

                if (reset) {
                    setItems(newItems);
                    setPage(2);
                } else {
                    setItems((prev) => [...prev, ...newItems]);
                    setPage((prev) => prev + 1);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        },
        [page, keyword, loading]
    );

    /** Initial load */
    useEffect(() => {
        loadData(true);
    }, []);

    /** Debounced search */
    useEffect(() => {
        const delay = setTimeout(() => {
            loadData(true, keyword);
        }, 500);
        return () => clearTimeout(delay);
    }, [keyword]);

    /** Infinite scroll observer */
    useEffect(() => {
        if (!observerRef.current || !hasMore || loading) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadData();
            }
        });

        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [observerRef, hasMore, loading, loadData]);

    const handleSelect = (item: T) => {
        setSelected(item);
        setDropdownOpen(false);
        onSelect?.(item);
    };

    const handleDeSelect = () => {
        setSelected(undefined);
        setDropdownOpen(false);
        onSelect?.(undefined);
    };

    return (
        <div className='w-full relative  dark:text-white/90'>
            <div
                className={`border dark:text-gray-400 rounded-md px-2 py-1.5 pl-4 cursor-pointer 
                  relative dark:border-gray-800  dark:text ${
                      isSelectDisabled
                          ? "cursor-not-allowed bg-gray-100 dark:bg-gray-700 "
                          : "bg-white dark:bg-slate-900"
                  }  `}
                onClick={() => {
                    if (!isSelectDisabled) {
                        setDropdownOpen((prev) => !prev);
                    } else {
                        return;
                    }
                }}
            >
                <div className={`flex items-center justify-between relative`}>
                    <span className='text-gray-800 font-medium'>
                        {" "}
                        {selected && getOptionLabel(selected)}
                    </span>
                    <span className='text-gray-400'>
                        {placeholder && !selected && placeholder}
                    </span>

                    <div className='flex gap-1 '>
                        {selected && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeSelect();
                                }}
                                className='bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full mx-0.5  py-0.5 flex items-center cursor-pointer'
                            >
                                <X height={"14"} />
                            </button>
                        )}

                        <div className='pointer-events-none  flex items-center px-2 text-gray-700'>
                            {loading ? <Spinner /> : <DropDownArrow />}
                        </div>
                    </div>
                </div>
            </div>

            {dropdownOpen && (
                <div className='absolute mt-1 w-full border-2 rounded-lg bg-white shadow z-10  dark:border-gray-800 dark:bg-slate-900'>
                    {/* Search */}
                    <div className='p-2'>
                        <input
                            type='text'
                            placeholder='Search...'
                            className='w-full border px-2 py-1  focus:border-brand-300 
                                                focus:ring-brand-500/10 dark:focus:border-brand-800 rounded-md  border-gray-300
                                                focus:ring-3 focus:outline-hidden 
                                                dark:border-gray-700 dark:bg-gray-900 dark:text-white/90
                                                dark:placeholder:text-white/30'
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>

                    {/* List */}
                    <div className='border max-h-60 overflow-auto bg-white dark:bg-slate-800 dark:border-gray-800'>
                        {items.map((item) => (
                            <div
                                key={getOptionValue(item)}
                                className={`p-2  flex justify-between items-center cursor-pointer border-b last:border-none dark:hover:bg-gray-600 hover:bg-gray-100 ${
                                    selected &&
                                    getOptionValue(selected) ===
                                        getOptionValue(item)
                                        ? "bg-blue-100 dark:bg-blue-950"
                                        : ""
                                }`}
                                onClick={() => handleSelect(item)}
                            >
                                {getOptionLabel(item)}
                                {selected &&
                                    getOptionValue(selected) ===
                                        getOptionValue(item) && (
                                        <span>
                                            <svg
                                                className='size-4 shrink-0 text-blue-600'
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='16'
                                                height='16'
                                                fill='currentColor'
                                                viewBox='0 0 16 16'
                                            >
                                                <path d='M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z'></path>
                                            </svg>
                                        </span>
                                    )}
                            </div>
                        ))}

                        {loading && (
                            <div className='flex items-center gap-4 p-2 text-center text-gray-500'>
                                <span> Loading...</span> <Spinner2 />
                            </div>
                        )}
                        <div ref={observerRef}></div>
                        {!hasMore && !loading && items.length > 0 && (
                            <div className='p-2 text-center text-gray-400 text-sm'>
                                No more results
                            </div>
                        )}
                        {!loading && items.length === 0 && (
                            <div className='p-2 text-center text-gray-500'>
                                No data found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
