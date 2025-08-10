import { api } from "../api";

const {
    useGetEmployeesQuery,
    useGetEmployeeViewQuery,
    useGetEmployeesByFeatureIdQuery,
    useLazyGetEmployeesByFeatureIdQuery,
    useLazyGetEmployeesQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
} = api;

export {
    useGetEmployeesQuery,
    useGetEmployeeViewQuery,
    useGetEmployeesByFeatureIdQuery,
    useLazyGetEmployeesByFeatureIdQuery,
    useLazyGetEmployeesQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
};
export * from "./useEmployee";
