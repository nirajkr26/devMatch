import { io } from "socket.io-client";
import { SERVER_URL } from "./constant";

export const createSocketConnection = () => {
    return io(SERVER_URL, {
        withCredentials: true
    });
};