import { Edit, PlusIcon } from "lucide-react";

type IProps = {
    isAdd: boolean;
    title: string;
};

const ModalHeader = (props: IProps) => {
    const { isAdd, title } = props;
    return (
        <div className='flex gap-2 items-center'>
            {isAdd ? (
                <PlusIcon className='dark:text-gray-200' />
            ) : (
                <Edit className='dark:text-gray-200' />
            )}
            <h4 className=' text-xl font-semibold dark:text-gray-200 '>
                {isAdd ? "Add New " : "Edit "} {title}
            </h4>
        </div>
    );
};

export default ModalHeader;
