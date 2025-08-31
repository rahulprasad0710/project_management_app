import { Trash } from "lucide-react";

type IProps = {
    heading: string;
    alertType: "DANGER" | "SUCCESS" | "WARNING" | "INFO";
    description: string | undefined;
    handleClick?: () => void;
    btnText: string;
    dataInfo: string;
};

const AlertModal = (props: IProps) => {
    const { handleClick, btnText, heading, description, dataInfo } = props;
    return (
        <div className='relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-6'>
            <div className='text-center'>
                <div className='relative flex items-center w-full justify-center'>
                    <div className='flex items-center justify-center z-1 mb-7 w-20 h-20 rounded-2xl bg-red-100 dark:bg-slate-600'>
                        <span>
                            <Trash
                                size={26}
                                className='text-shadow-red-400 text-red-500'
                            />
                        </span>
                    </div>
                </div>

                <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm'>
                    {heading}
                </h4>
                <p className='text-md font-medium leading-6 text-gray-600 dark:text-gray-400'>
                    {dataInfo}
                </p>
                <p className='text-sm leading-6 text-gray-500 dark:text-gray-400'>
                    {description}
                </p>

                <div className='flex items-center justify-center w-full gap-3 mt-7'>
                    <button
                        onClick={handleClick ? () => handleClick() : () => {}}
                        type='button'
                        className='flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-error-500 shadow-theme-xs hover:bg-error-600 sm:w-auto'
                    >
                        {btnText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
