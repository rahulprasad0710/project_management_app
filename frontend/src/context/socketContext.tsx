import { Socket } from "socket.io-client";
import { createContext } from "react";

export type TNotification = {
    message: string;
    createdAt: string;
    link: string;
    id: number;
    type: string;
};

type SocketContextType = {
    socket: Socket | null;
    notifications: TNotification[];
    setNotifications: React.Dispatch<React.SetStateAction<TNotification[]>>;
};

export const SocketContext = createContext<SocketContextType | undefined>(
    undefined
);
