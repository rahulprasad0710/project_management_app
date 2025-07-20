import {
  Download,
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Trash,
} from "lucide-react";

import React from "react";

interface Props {
  fileName: string;
  handleClick: () => void;
  showDownloadButton?: boolean;
  showDeleteButton?: boolean;
  url?: string;
  index: number;
}

const getFileIcon = (extension: string) => {
  switch (extension) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return <FileImage className="h-5 w-5 text-blue-500" />;
    case "pdf":
    case "txt":
      return <FileText className="h-5 w-5 text-red-500" />;
    case "xlsx":
    case "xls":
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    case "zip":
    case "rar":
      return <FileArchive className="h-5 w-5 text-yellow-600" />;
    case "mp4":
    case "webm":
      return <FileVideo className="h-5 w-5 text-purple-500" />;
    case "mp3":
    case "wav":
      return <FileAudio className="h-5 w-5 text-indigo-500" />;
    case "js":
    case "ts":
    case "json":
    case "html":
    case "css":
      return <FileCode className="h-5 w-5 text-orange-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};

export const FileComment: React.FC<Props> = ({
  handleClick,
  fileName,
  showDownloadButton,
  showDeleteButton,
  url,
  index,
}) => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  const handleDownload = () => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mb-1 flex items-center justify-between gap-4 rounded-md border border-gray-200 bg-gray-50 p-2 text-sm text-gray-700">
      <div className="gpa-2 flex items-center">
        <span className="mr-2 bg-slate-100 px-2 font-semibold text-slate-800">
          {index}
        </span>
        {showDownloadButton && (
          <button
            title="Download"
            type="button"
            onClick={handleDownload}
            className="rounded p-1 hover:bg-gray-200"
          >
            <Download className="h-4 w-4 text-blue-600" />
          </button>
        )}
        <div className="gpa-2 flex items-center border-l border-gray-200 pl-2">
          {getFileIcon(extension)}
          <p className="ml-2 line-clamp-[calc(var(--characters)/100)] text-sm font-medium text-gray-700">
            {fileName}
          </p>
        </div>
      </div>

      {showDeleteButton && (
        <button
          type="button"
          title="Delete"
          onClick={handleClick}
          className="hover:bg-grey-100 rounded p-1"
        >
          <Trash className="h-4 w-4 font-semibold text-red-400 hover:text-red-600" />
        </button>
      )}
    </div>
  );
};
