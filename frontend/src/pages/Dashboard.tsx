import React, { useEffect } from "react";

import { useLazyGetLabelsQuery } from "@/store/api";

const Dashboard = () => {
    const [fetchAllLabels, { isFetching, data }] = useLazyGetLabelsQuery();

    useEffect(() => {
        fetchAllLabels({
            isPaginationEnabled: true,
            page: data?.data?.pagination?.currentPage
                ? data?.data?.pagination?.currentPage - 1
                : 1,
            pageSize: data?.data?.pagination?.pageSize,
            keyword: "",
            isActive: true,
        });
    }, []);

    return <div>Dashboard</div>;
};

export default Dashboard;
