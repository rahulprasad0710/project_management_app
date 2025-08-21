import { useEffect, useState } from "react";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/button/Button";
import type { ICustomerResponse } from "@/types/hotel.type";
import ReactTable from "@/components/common/ReactTable";
import SearchBar from "@/components/molecules/SearchBar";
import Switch from "@/components/form/switch/Switch";
import { createColumnHelper } from "@tanstack/react-table";
import { useLazyGetAllCustomerQuery } from "@apiHooks/useCustomer";

const CustomerListPage = () => {
    const [keyword, setKeyword] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [fetchAll, { isFetching, data: dataList }] =
        useLazyGetAllCustomerQuery();

    console.log({
        dataList,
    });

    useEffect(() => {
        fetchAll({
            isPaginationEnabled: true,
            page: 1,
            pageSize: 10,
        });
    }, []);

    const handleSearch = () => {
        fetchAll({
            isPaginationEnabled: true,
            page: 1,
            pageSize: 10,
            keyword: keyword,
            isActive: isActive,
        });
    };

    const handleClearFilter = () => {
        setKeyword("");
        fetchAll({
            isPaginationEnabled: true,
            page: 1,
            pageSize: 10,
            isActive: isActive,
            keyword: "",
        });
    };

    const handlePrevious = () => {
        if (
            !dataList?.data?.pagination?.currentPage ||
            dataList?.data?.pagination?.currentPage === 1
        )
            return;

        fetchAll({
            isPaginationEnabled: true,
            page: dataList?.data?.pagination?.currentPage - 1,
            pageSize: dataList?.data?.pagination?.pageSize,
            keyword: "",
        });
    };

    const handleNext = () => {
        if (!dataList?.data?.pagination?.currentPage) return;

        fetchAll(
            {
                isPaginationEnabled: true,
                page: dataList?.data?.pagination?.currentPage + 1,
                pageSize: dataList?.data?.pagination?.pageSize,
            },
            true
        );
    };

    const columnHelper = createColumnHelper<ICustomerResponse>();

    const columns = [
        columnHelper.accessor((row) => row.name, {
            id: "name",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Name</div>,
        }),
        columnHelper.accessor((row) => row.mobileNumber, {
            id: "mobileNumber",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Mobile Number</div>,
        }),
        columnHelper.accessor((row) => row.email, {
            id: "email",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Email</div>,
        }),

        columnHelper.accessor((row) => row.isActive, {
            id: "is_active",
            cell: (info) => (
                <div
                    style={{
                        width: "120px",
                    }}
                    className='font-semibold py-1 px-4'
                >
                    {info.renderValue() ? (
                        <Badge badgeType='success' title='Active' />
                    ) : (
                        <Badge badgeType='error' title='Inactive' />
                    )}
                </div>
            ),
            header: () => <div>Status</div>,
        }),

        columnHelper.accessor((row) => row.emailVerified, {
            id: "emailVerified",
            cell: (info) => (
                <div
                    style={{
                        width: "120px",
                    }}
                    className='font-semibold py-1 px-4'
                >
                    {info.renderValue() ? (
                        <Badge badgeType='success' title='Email Verified' />
                    ) : (
                        <Badge badgeType='warning' title='Email Not Verified' />
                    )}
                </div>
            ),
            header: () => <div>Status</div>,
        }),

        columnHelper.accessor((row) => row.CredentialType, {
            id: "CredentialType",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Added By</div>,
        }),
    ];

    return (
        <div className='rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-slate-800'>
            <div className='flex flex-col justify-end md:justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-700'>
                <div>
                    <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                        Customer List
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        View Customer List
                    </p>
                </div>
                <div className='flex items-center  justify-end  gap-4 md:gap-6 flex-wrap'>
                    <Switch
                        onChange={() => {
                            setIsActive(!isActive);
                            handleSearch();
                        }}
                        label='Show only Active customer'
                        defaultChecked={isActive}
                    />
                    <div>
                        <SearchBar
                            onClose={handleClearFilter}
                            setKeyword={setKeyword}
                            keyword={keyword}
                        />
                    </div>

                    <Button
                        variant='outline'
                        size='xs'
                        onClick={handleSearch}
                        type='button'
                    >
                        Search
                    </Button>
                </div>
            </div>

            <div className='border-t border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-slate-900 sm:p-6'>
                <ReactTable
                    isFetching={isFetching}
                    showPagination={true}
                    columns={columns ?? []}
                    handleNext={handleNext}
                    handlePrevious={handlePrevious}
                    data={dataList?.data.result ?? []}
                    pagination={
                        dataList?.data?.pagination ?? {
                            currentPage: 1,
                            pageSize: 10,
                            totalCount: 10,
                            totalPages: 1,
                        }
                    }
                />
            </div>
        </div>
    );
};

export default CustomerListPage;
