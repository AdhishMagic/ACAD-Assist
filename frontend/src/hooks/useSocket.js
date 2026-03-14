import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";

export function useSocket(url = import.meta.env.VITE_SOCKET_URL) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    socketRef.current = io(url, { auth: { token }, transports: ["websocket"] });

    socketRef.current.on("connect", () => setIsConnected(true));
    socketRef.current.on("disconnect", () => setIsConnected(false));

    return () => { socketRef.current?.disconnect(); };
  }, [url]);

  const emit = useCallback((event, data) => { socketRef.current?.emit(event, data); }, []);
  const on = useCallback((event, callback) => { socketRef.current?.on(event, callback); }, []);
  const off = useCallback((event, callback) => { socketRef.current?.off(event, callback); }, []);

  return { socket: socketRef.current, isConnected, emit, on, off };
}
