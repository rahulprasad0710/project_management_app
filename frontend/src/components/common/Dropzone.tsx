import type { ChangeEvent, DragEvent } from "react";
import React, { useRef } from "react";

import { FileComment } from "@molecules/FileIcon";
import type { IUploadFile } from "@/types/config.types";

type FileProps = {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    OldFiles: IUploadFile[];
    setOldFiles: React.Dispatch<React.SetStateAction<IUploadFile[]>>;
    acceptType: string[];
};

const Dropzone = ({
    files,
    setFiles,
    OldFiles,
    setOldFiles,
    acceptType,
}: FileProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(selectedFiles);
        }
    };

    const handleDeleteOldFiles = (id: string) => {
        const temp = OldFiles.filter((item) => item.id !== id);
        setOldFiles(temp);
    };

    const handleDeleteFile = (index: number) => {
        const updatedFiles = files.filter((_, idx) => idx !== index);
        setFiles(updatedFiles);
    };

    return (
        <div
            className={
                files.length === 0
                    ? "grid grid-cols-1 gap-4"
                    : "grid grid-cols-1 gap-4"
            }
        >
            <div>
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => inputRef.current?.click()}
                    className='flex w-full items-center justify-center bg-gray-200 text-gray-700 dark:bg-gray-800 rounded-xl'
                >
                    <label className='flex h-48 min-h-48 w-full items-center justify-center bg-gray-100 dark:bg-gray-800  cursor-pointer transition border border-gray-300 border-dashed  dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500'>
                        <div className='flex flex-col items-center justify-center pb-6 pt-5'>
                            <div className='flex h-[68px] w-[68px] mb-4  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                                <svg
                                    className='fill-current'
                                    width='29'
                                    height='28'
                                    viewBox='0 0 29 28'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        fillRule='evenodd'
                                        clipRule='evenodd'
                                        d='M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z'
                                    />
                                </svg>
                            </div>
                            <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                                <span className='font-semibold'>
                                    Click to upload
                                </span>{" "}
                                or drag and drop
                            </p>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                Drag and drop files here or click to upload
                            </p>
                        </div>
                        <input
                            type='file'
                            multiple
                            ref={inputRef}
                            onChange={handleFileChange}
                            id='dropzone-file'
                            className='hidden'
                            accept={
                                acceptType
                                    ? Array.isArray(acceptType)
                                        ? acceptType.join(",")
                                        : acceptType
                                    : "*/*"
                            }
                        />
                    </label>
                </div>
            </div>

            <div>
                {files.length > 0 && (
                    <ul className='grid-col-1 grid cursor-pointer gap-2 rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 md:grid-cols-2'>
                        {files.map((file, idx) => (
                            <li key={idx}>
                                <FileComment
                                    index={idx + 1}
                                    showDeleteButton={true}
                                    showDownloadButton={false}
                                    handleClick={() => handleDeleteFile(idx)}
                                    fileName={file.name}
                                />
                            </li>
                        ))}
                    </ul>
                )}

                {OldFiles?.length > 0 && (
                    <ul className='grid-col-1 grid cursor-pointer gap-2 rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 md:grid-cols-2'>
                        {OldFiles?.length > 0 &&
                            OldFiles?.map((file, index: number) => (
                                <li key={file.id}>
                                    <FileComment
                                        index={index + 1}
                                        url={file.backendUrl}
                                        showDeleteButton={true}
                                        showDownloadButton={true}
                                        handleClick={() =>
                                            handleDeleteOldFiles(file.id)
                                        }
                                        fileName={file.originalname}
                                    />
                                </li>
                            ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Dropzone;
