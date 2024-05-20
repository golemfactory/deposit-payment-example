import useSWRSubscription from "swr/subscription";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

const socket = io(`http://localhost:5174/me`, {
  autoConnect: false,
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
    socket.on("user", (data) => {
      setIsLoading(false);
      next(null, data);
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
