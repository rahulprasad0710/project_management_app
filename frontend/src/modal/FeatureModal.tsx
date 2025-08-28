import * as yup from "yup";

import type {
    IFeatureDetailsResponse,
    IFeatureUpdatePayload,
    IMultiList,
    IUploadFile,
    ImageResponse,
} from "@/types/config.types";
import { useEffect, useState } from "react";
import {
    useLazyGetFeaturesByIdQuery,
    useUpdateFeaturesMutation,
} from "@api/hooks/useFeature";

import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import ModalHeader from "@/components/atoms/ModalHeader";
import MultiSelect from "@components/atoms/MultiSelect";
import { Spinner } from "@/components/atoms/Spinner";
import type { SubmitHandler } from "react-hook-form";
import Switch from "@/components/form/switch/Switch";
import { X } from "lucide-react";
import { inputFieldClass } from "@/utils/style";
import { toast } from "react-toastify";
import { useCreateUploadsMutation } from "@/api/hooks/useUpload";
import { useForm } from "react-hook-form";
import { useGetEmployeesQuery } from "@api/hooks/useEmployee";
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
    selectedData: IFeatureDetailsResponse | undefined;
    setSelectedData: (data: IFeatureDetailsResponse | undefined) => void;
    handleCloseModal: () => void;
};

interface IFormInput {
    name: string;
    description: string;
    admin: string;
}

const FeatureModal = (props: Props) => {
    const { selectedData, handleCloseModal } = props;
    const [selectedFeatureMember, setSelectedFeatureMember] = useState<
        IMultiList[]
    >([]);

    const [files, setFiles] = useState<File[]>([]);
    const [oldFiles, setOldFiles] = useState<ImageResponse>();
    const { data: employeesList } = useGetEmployeesQuery({
        isActive: true,
        isPaginationEnabled: false,
        page: 1,
        pageSize: 10,
        keyword: "",
    });

    const [fetchDetailsById] = useLazyGetFeaturesByIdQuery();

    const [createUploadMutation] = useCreateUploadsMutation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(selectedFiles);
        }
    };

    const [updateMutation] = useUpdateFeaturesMutation();

    const [isRoomActive, setIsRoomActive] = useState<boolean>(true);

    const defaultValues: IFormInput = {
        name: "",
        description: "",
        admin: "",
    };

    const schema = yup.object().shape({
        name: yup.string().required("Name is required"),
        description: yup.string().required("Description is required."),
        admin: yup.string().required("Select Admin."),
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<IFormInput>({
        resolver: yupResolver(schema),
        defaultValues: defaultValues,
    });

    useEffect(() => {
        console.log({
            selectedData,
        });
        if (selectedData?.id && employeesList?.data?.result) {
            reset({
                name: selectedData.name,
                description: selectedData?.description,
                admin: String(selectedData?.admin?.id),
            });
            setOldFiles(selectedData?.profilePictureResponse);

            setIsRoomActive(selectedData?.active);
            setSelectedFeatureMember(
                selectedData?.featureTeamMember?.map((member) => {
                    const temp: IMultiList = {
                        label: `${member.firstName} ${member.lastName}`,
                        value: String(member.id),
                    };
                    return temp;
                })
            );
        }
    }, [selectedData, employeesList]);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        if (!selectedData?.id) {
            return;
        }

        try {
            const payload: IFeatureUpdatePayload = {
                id: selectedData?.id,
                name: data.name,
                admin: Number(data.admin),
                active: isRoomActive,
                description: data.description,
                profilePicture: oldFiles?.id ?? "",
                featureTeamMember:
                    selectedFeatureMember?.map((member) =>
                        Number(member.value)
                    ) ?? [],
            };

            if (files?.length > 0) {
                const fileResponseList = await Promise.all(
                    files.map(async (file: File) => {
                        const response = await createUploadMutation({
                            files: [file],
                        }).unwrap();
                        return response;
                    })
                );

                payload.profilePicture = fileResponseList[0].data?.id;
            }

            const response = await updateMutation(payload).unwrap();
            if (response.success) {
                fetchDetailsById({
                    payloadId: selectedData?.id,
                });
                toast.success("Feature updated successfully");
                handleCloseModal();
            }

            return response;
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong!");
        }
    };

    const removeFile = () => {
        setFiles([]);
    };

    return (
        <div className='relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-6'>
            <div className='flex gap-2 w-full my-4   px-4  items-center justify-between  text-gray-800 dark:text-white/90'>
                <ModalHeader
                    title={"Feature"}
                    isAdd={selectedData?.id ? false : true}
                />
            </div>

            <div className='grid grid-cols-12 gap-4'>
                {files.length > 0 && (
                    <div className='col-span-3 '>
                        {files.map((file, index) => (
                            <div key={index} className=' relative'>
                                <span className='absolute top-[-8px] right-[-8px] bg-gray-100 rounded-full text-gray-400 hover:text-red-500 cursor-pointer shadow'>
                                    <X
                                        size={"18"}
                                        onClick={() => removeFile()}
                                    />
                                </span>
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className='w-full h-32 object-cover rounded-lg border'
                                />
                                <p className='text-xs text-gray-500 truncate mt-1'>
                                    {file.name}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                {oldFiles && (
                    <div className='col-span-3'>
                        <img
                            className='w-full h-32 object-cover rounded-lg border'
                            src={oldFiles?.url}
                            alt='user'
                        />
                    </div>
                )}
            </div>

            <form
                className='bg-white px-4 py-4 dark:bg-slate-800'
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className='grid grid-cols-12 gap-x-6 gap-y-5 lg:grid-cols-12 mb-4'>
                    <div className='col-span-12'>
                        <Label>
                            Thumbnail
                            <span className='text-error-500'>*</span>
                        </Label>
                        <div>
                            <input
                                type='file'
                                accept={"image/*"}
                                onChange={(e) => handleFileChange(e)}
                                className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400 `}
                            />
                        </div>
                    </div>
                    <div className='col-span-12'>
                        <Label>
                            Feature name
                            <span className='text-error-500'>*</span>
                        </Label>
                        <div className='relative'>
                            <input
                                className={inputFieldClass({
                                    error: errors.name ? true : false,
                                })}
                                {...register("name", {
                                    required: true,
                                })}
                            />
                            {errors.name && (
                                <span className='text-error-400 text-sm'>
                                    {errors.name.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className='col-span-12'>
                        <Label>
                            Admin
                            <span className='text-error-500'>*</span>
                        </Label>
                        <div className='relative'>
                            <select
                                className='block w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none'
                                {...register("admin", { required: true })}
                            >
                                <option
                                    value=''
                                    className='text-gray-400 bg-white '
                                    disabled
                                >
                                    Select Admin
                                </option>
                                {employeesList?.data?.result.map((employee) => (
                                    <option
                                        className='text-gray-700 bg-white hover:bg-blue-100 dark:text-slate-600 dark:bg-slate-800'
                                        value={String(employee.id)}
                                        key={employee.id}
                                    >
                                        {employee.firstName}
                                        {employee.lastName}
                                    </option>
                                ))}
                            </select>
                            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                                <svg
                                    className='h-4 w-4 fill-current'
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 20 20'
                                >
                                    <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                                </svg>
                            </div>
                        </div>
                        {errors.admin && (
                            <span className='text-error-400 text-sm'>
                                {errors.admin?.message}
                            </span>
                        )}
                    </div>

                    <div className='col-span-12 mb-4'>
                        <Label>
                            Description
                            <span className='text-error-500'>*</span>
                        </Label>
                        <div className='relative'>
                            <input
                                className={inputFieldClass({
                                    error: errors.description ? true : false,
                                })}
                                {...register("description", {
                                    required: true,
                                })}
                            />
                            {errors.description && (
                                <span className='text-error-400 text-sm'>
                                    {errors.description.message}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className='col-span-12'>
                        <MultiSelect
                            selectedList={selectedFeatureMember}
                            setSelectList={setSelectedFeatureMember}
                            list={
                                (employeesList?.data &&
                                    employeesList?.data?.result?.map(
                                        (employee) => {
                                            const payload = {
                                                label: `${employee.firstName} ${employee.lastName}`,
                                                value: String(employee.id),
                                            };
                                            return payload;
                                        }
                                    )) ??
                                []
                            }
                        />
                    </div>
                </div>

                <div className='mt-4 flex items-center justify-between gap-4'>
                    <div className='relative'>
                        <Switch
                            defaultChecked={isRoomActive}
                            onChange={() => {
                                setIsRoomActive(!isRoomActive);
                            }}
                            label='Active'
                        />
                    </div>
                    <div className='flex items-center mb-4  gap-4'>
                        <Button
                            size='sm'
                            className='px-6!'
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Spinner />
                            ) : (
                                <span>
                                    {" "}
                                    {selectedData?.id
                                        ? "Update"
                                        : "Submit"}{" "}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FeatureModal;
