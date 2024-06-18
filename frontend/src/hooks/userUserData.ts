import useSWRSubscription from "swr/subscription";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

const socket = io(`${import.meta.env.VITE_BACKEND_WS_URL}/me`, {
  autoConnect: false,
  transports: ["websocket"],
});

export const useUserData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken] = useLocalStorage("accessToken");

  useEffect(() => {
    if (accessToken) {
      socket.auth = { token: accessToken };
      socket.connect();
    }
  }, [accessToken]);

  const { data, error } = useSWRSubscription("userData", (key, { next }) => {
    socket.on("user", (data: any) => {
      setIsLoading(false);
      next(null, data);
    });
    socket.on("error", (error: any) => {
      console.error("error is socket io ", error);
    });
    return () => {
      socket.disconnect();
    };
  });

  return {
    isLoading,
    data: data || [],
    error,
  };
};
