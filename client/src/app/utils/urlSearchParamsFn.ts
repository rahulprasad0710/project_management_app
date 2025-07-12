"use client";

import { useEffect, useState } from "react";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { IMultiList } from "@/types/user.types";
import { useSearchParams } from "next/navigation";

type HasId = { id: string | number; [key: string]: any };

type Params<T extends HasId> = {
  urlDataName: string;
  dataToFetchDataFrom: T[] | undefined;
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIds: string[];
  setMultiSelectList: React.Dispatch<React.SetStateAction<IMultiList[]>>;
  labelKey: string;
  isDataLoading: boolean;
  router: AppRouterInstance;
};

export function useGetQueryParams<T extends HasId>({
  urlDataName,
  dataToFetchDataFrom,
  setSelectedIds,
  setMultiSelectList,
  labelKey,
  isDataLoading,
  selectedIds,
  router,
}: Params<T>) {
  const searchParams = useSearchParams();

  const [isDataValueSet, setIsDataValueSet] = useState<boolean>(false);

  useEffect(() => {
    const labelFromUrl = searchParams.get(urlDataName);
    const listResponse = dataToFetchDataFrom ?? [];

    if (labelFromUrl && listResponse.length > 0) {
      const tempIds = labelFromUrl.split(",");
      setSelectedIds(tempIds);
      const selectedItems = listResponse.filter((item) =>
        tempIds.includes(String(item.id)),
      );
      if (selectedItems && selectedItems.length > 0) {
        const list = selectedItems?.map((item) => {
          return {
            label: item[labelKey as string] as string,
            value: String(item.id) as string,
          };
        });
        setMultiSelectList(list);
        setIsDataValueSet(true);
      }
    }

    if (!labelFromUrl || !isDataLoading) {
      setIsDataValueSet(true);
    }
  }, [
    dataToFetchDataFrom,
    isDataLoading,
    labelKey,
    searchParams,
    setMultiSelectList,
    setSelectedIds,
    urlDataName,
  ]);

  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (selectedIds.length > 0) {
      params.set(urlDataName, selectedIds.join(","));
    } else {
      params.delete(urlDataName);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams, selectedIds, urlDataName]);

  return isDataValueSet;
}
