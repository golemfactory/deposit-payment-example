import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

import { createPublicClient, http } from "viem";
import { holesky } from "viem/chains";
import { abi } from "./abi";
import { config } from "config";
import { useRequestorWalletAddress } from "hooks/useRequestorWalletAddress";
import { ZERO_ADDRESS } from "types/zero";
import { useLocalStorage } from "hooks/useLocalStorage";

type WithBlockNumber<T> = T & { blockNumber: bigint };

export const useAllowanceTx = () => {
  const { address } = useAccount();
  const [txHash, setTxHash] = useLocalStorage("0x");
  const { data: requestor } = useRequestorWalletAddress();
  const client = useMemo(
    () =>
      //  this is internal problem of the viem.
      // TODO : investigate type incompatible issue
      createPublicClient({
        // @ts-ignore
        chain: holesky,
        transport: http(),
      }),
    []
  );

  useEffect(() => {
    const fetchLogs = async () => {
      const block = await client.getBlock();
      const logs = await client.getContractEvents({
        address: config.GLMContractAddress[holesky.id],
        abi: abi,
        eventName: "Approval",
        args: {
          //with undefined address it will return all logs
          owner: address || ZERO_ADDRESS,
          spender: requestor?.wallet,
        },
        fromBlock: block.number - 1000n,
      });
      return logs;
    };

    const compareBlockNumbers = (
      a: WithBlockNumber<{}>,
      b: WithBlockNumber<{}>
    ) => {
      return Number(a.blockNumber) - Number(b.blockNumber);
    };

    fetchLogs().then((logs) => {
      const sortedLogs = logs.sort(compareBlockNumbers);
      if (sortedLogs.length > 0) {
        console.log("hh");
        setTxHash(sortedLogs[logs.length - 1].transactionHash);
      }
    });
  }, [address, requestor?.wallet]);

  return { txHash };
};
