import useSWR from "swr";

import { UserData } from "types/user";
const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  }).then((res) => res.json());

export const useUserData = (): {
  userData?: UserData;
  error?: Error;
  isLoading: boolean;
} => {
  const { data, error, isLoading } = useSWR<UserData>(
    `${import.meta.env.VITE_BACKEND_URL}/me`,
    fetcher
  );

  return {
    userData: data,
    error,
    isLoading: isLoading,
  };
};
