import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    LazyQueryTrigger,
    QueryDefinition,
} from "@reduxjs/toolkit/query/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import type { ResponseWithPagination } from "@/types/config.types";
import type { SerializedError } from "@reduxjs/toolkit";

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
    onSelect?: (value: T) => void;
}

export default function InfiniteScrollSelect<T>({
    fetchAll,
    getOptionLabel,
    getOptionValue,
    preselectedValue,
    onSelect,
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

    return (
        <div className='w-64 relative'>
            {/* Selected value display */}
            <div
                className='border rounded px-2 py-1 cursor-pointer bg-white'
                onClick={() => setDropdownOpen((o) => !o)}
            >
                {selected ? getOptionLabel(selected) : "Select an option"}
            </div>

            {dropdownOpen && (
                <div className='absolute mt-1 w-full border rounded-lg bg-white shadow z-10'>
                    {/* Search */}
                    <div className='p-2'>
                        <input
                            type='text'
                            placeholder='Search...'
                            className='w-full border px-2 py-1 rounded'
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>

                    {/* List */}
                    <div className='max-h-60 overflow-auto'>
                        {items.map((item) => (
                            <div
                                key={getOptionValue(item)}
                                className={`p-2 cursor-pointer border-b last:border-none hover:bg-gray-100 ${
                                    selected &&
                                    getOptionValue(selected) ===
                                        getOptionValue(item)
                                        ? "bg-blue-100"
                                        : ""
                                }`}
                                onClick={() => handleSelect(item)}
                            >
                                {getOptionLabel(item)}
                            </div>
                        ))}

                        {loading && (
                            <div className='p-2 text-center text-gray-500'>
                                Loading...
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
