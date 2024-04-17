import useSWR from "swr";

import { UserData } from "types/user";
const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
    .then((res) => {
      console.log("refetch");
      return res.json();
    })
    .catch((error) => {
      console.error("Error fetching user data", error);
    });

export const useUserData = (): {
  userData?: UserData;
  error?: Error;
  isLoading: boolean;
} => {
  const { data, error, isLoading } = useSWR<UserData>(
    `${import.meta.env.VITE_BACKEND_URL}/me`,
    fetcher,
    { refreshInterval: 5000 }
  );
  console.log("data", data);
  return {
    userData: data,
    error,
    isLoading: isLoading,
  };
};
