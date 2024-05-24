import { useAccount, useBalance as useBalanceWagmi } from "wagmi";

import { config } from "config";
import { useChainId } from "hooks/useChainId";

export const useBalance = () => {
  const { address } = useAccount();
  const chainId = useChainId();

  const glmAddress = config.GLMContractAddress[chainId];
  const settings = {
    query: {
      refetchInterval: 2000,
    },
  };
  const glmBalance = useBalanceWagmi({
    address: address,
    token: glmAddress,
    ...settings,
  });

  const nativeBalance = useBalanceWagmi({
    address: address,
    ...settings,
  });

  return {
    GLM: glmBalance.data?.value ?? 0n,
    ETH: nativeBalance.data?.value ?? 0n,
  };
};
