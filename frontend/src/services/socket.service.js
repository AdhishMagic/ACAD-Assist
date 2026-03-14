import { io } from "socket.io-client";
import { env } from "@/config/env";

let socket = null;

export const socketService = {
  connect(token) {
    socket = io(env.SOCKET_URL, { auth: { token }, transports: ["websocket"] });
    return socket;
  },
  disconnect() { socket?.disconnect(); socket = null; },
  getSocket() { return socket; },
  emit(event, data) { socket?.emit(event, data); },
  on(event, callback) { socket?.on(event, callback); },
  off(event, callback) { socket?.off(event, callback); },
};
