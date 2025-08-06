import { useEffect, useState } from "react";

import type { IMultiList } from "@/types/config.types";
import { useSearchParams } from "react-router-dom";

type HasId = { id: string | number; [key: string]: any };

type Params<T extends HasId> = {
    urlDataName: string;
    dataToFetchDataFrom: T[] | undefined;
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
    selectedIds: string[];
    setMultiSelectList: React.Dispatch<React.SetStateAction<IMultiList[]>>;
    labelKey: string;
    isDataLoading: boolean;
};

export function useGetQueryParams<T extends HasId>({
    urlDataName,
    dataToFetchDataFrom,
    setSelectedIds,
    setMultiSelectList,
    labelKey,
    isDataLoading,
    selectedIds,
}: Params<T>) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isDataValueSet, setIsDataValueSet] = useState<boolean>(false);

    // Set state from URL param when data loads
    useEffect(() => {
        const labelFromUrl = searchParams.get(urlDataName);
        const listResponse = dataToFetchDataFrom ?? [];

        if (labelFromUrl && listResponse.length > 0) {
            const tempIds = labelFromUrl.split(",");
            setSelectedIds(tempIds);
            const selectedItems = listResponse.filter((item) =>
                tempIds.includes(String(item.id))
            );
            if (selectedItems.length > 0) {
                const list = selectedItems.map((item) => ({
                    label: item[labelKey],
                    value: String(item.id),
                }));
                setMultiSelectList(list);
                setIsDataValueSet(true);
            }
        }

        if (!labelFromUrl || !isDataLoading) {
            setIsDataValueSet(true);
        }
    }, [
        searchParams,
        dataToFetchDataFrom,
        isDataLoading,
        labelKey,
        setMultiSelectList,
        setSelectedIds,
        urlDataName,
    ]);

    // Sync state to URL param
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (selectedIds.length > 0) {
            params.set(urlDataName, selectedIds.join(","));
        } else {
            params.delete(urlDataName);
        }
        setSearchParams(params, { replace: true });
    }, [selectedIds, setSearchParams, searchParams, urlDataName]);

    return isDataValueSet;
}
