export const useTokens = () => {
  return {
    register: async (walletAddress: string) => {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }
    },
  };
};
