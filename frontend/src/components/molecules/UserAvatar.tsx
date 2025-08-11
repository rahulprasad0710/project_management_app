import type { IUser } from "@/types/config.types";
import Image from "./Image";
import { User } from "lucide-react";

type Props = {
    user: Partial<IUser>;
    size?: "sm" | "md" | "xs";
};

const UserAvatar = ({ user, size = "md" }: Props) => {
    const imageSize = {
        sm: 18,
        md: 24,
        xs: 18,
    };
    return (
        <div>
            {user?.profilePictureUrl ? (
                <Image
                    src={user?.profilePictureUrl}
                    alt={
                        user?.firstName && user?.firstName
                            ? `${user?.firstName} ${user?.lastName}`
                            : "user"
                    }
                    width={imageSize[size]}
                    height={imageSize[size]}
                    className='flex items-center justify-center rounded-full bg-gray-200'
                />
            ) : (
                <div
                    title={
                        user?.firstName && user?.firstName
                            ? `${user?.firstName} ${user?.lastName}`
                            : "unassigned"
                    }
                    className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-200'
                >
                    <User className='h-5 w-5 text-gray-500' />
                </div>
            )}
        </div>
    );
};

export default UserAvatar;
