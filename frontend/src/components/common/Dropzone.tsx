import type { ChangeEvent, DragEvent } from "react";
import React, { useRef } from "react";

import { FileComment } from "@molecules/FileIcon";
import type { IUploadFile } from "@/types/config.types";

type FileProps = {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    OldFiles: IUploadFile[];
    setOldFiles: React.Dispatch<React.SetStateAction<IUploadFile[]>>;
};

const Dropzone = ({ files, setFiles, OldFiles, setOldFiles }: FileProps) => {
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
                    className='flex w-full items-center justify-center bg-white'
                >
                    <label className='flex h-48 min-h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'>
                        <div className='flex flex-col items-center justify-center pb-6 pt-5'>
                            <svg
                                className='mb-3 h-10 w-10 text-gray-400'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                    stroke-width='2'
                                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                                ></path>
                            </svg>
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
