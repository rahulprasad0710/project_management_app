import { IUser } from "@/types/user.types";
import Image from "next/image";
import React from "react";
import { User } from "lucide-react";

type Props = {
  user?: IUser;
};

const UserAvatar = ({ user }: Props) => {
  return (
    <div>
      {user?.profilePictureUrl ? (
        <Image
          src={
            "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={
            user?.firstName && user?.firstName
              ? `${user?.firstName} ${user?.lastName}`
              : "user"
          }
          width={32}
          height={32}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200"
        />
      ) : (
        <div
          title={
            user?.firstName && user?.firstName
              ? `${user?.firstName} ${user?.lastName}`
              : "unassigned"
          }
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200"
        >
          <User className="h-5 w-5 text-gray-500" />
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
