import { useEffect, useMemo, useState } from "react";
import { useAccount, useWatchContractEvent } from "wagmi";

import { createPublicClient, http } from "viem";
import { holesky } from "viem/chains";
import { abi } from "./abi";
import { config } from "config";
import { useRequestorWalletAddress } from "hooks/useRequestorWalletAddress";

type WithBlockNumber<T> = T & { blockNumber: bigint };

export const useAllowanceTx = () => {
  const { address } = useAccount();
  const [txHash, setTxHash] = useState<`0x${string}`>();
  const { data: requestor } = useRequestorWalletAddress();
  const client = useMemo(
    () =>
      createPublicClient({
        chain: holesky,
        transport: http(),
      }),
    []
  );

  useEffect(() => {
    client.watchContractEvent({
      address: config.GLMContractAddress[holesky.id],
      abi: abi,
      eventName: "Approval",
      args: {
        owner: address,
        spender: requestor?.wallet,
      },
      onLogs: (logs) => {
        const newApprove = logs.sort(
          (a, b) => Number(a.blockNumber) - Number(b.blockNumber)
        )[logs.length - 1];

        if (newApprove.transactionHash) {
          setTxHash(newApprove.transactionHash);
        }
      },
    });
  }, [address, requestor?.wallet]);
  useEffect(() => {
    const fetchLogs = async () => {
      const block = await client.getBlock();
      // if (!address) {
      //   return [];
      // }
      const logs = await client.getContractEvents({
        address: config.GLMContractAddress[holesky.id],
        abi: abi,
        eventName: "Approval",
        args: {
          owner: address,
          spender: requestor?.wallet,
        },
        fromBlock: block.number - 1000n,
      });
      console.log("logs", logs);
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
        setTxHash(sortedLogs[logs.length - 1].transactionHash);
      }
    });
  }, [address, requestor?.wallet]);

  useWatchContractEvent({
    address: config.GLMContractAddress[holesky.id],
    abi: abi,
    eventName: "Transfer",
    // args: {
    //   owner: address,
    //   spender: requestor?.wallet,
    // },
    onLogs: (logs) => {
      const newApprove = logs.sort(
        (a, b) => Number(a.blockNumber) - Number(b.blockNumber)
      )[logs.length - 1];

      if (newApprove.transactionHash) {
        setTxHash(newApprove.transactionHash);
      }
    },
  });

  // useWatchContractEvent({
  //   address: config.GLMContractAddress[holesky.id],
  //   abi: abi,
  //   eventName: "Approval",
  //   // args: {
  //   //   owner: address,
  //   //   spender: requestor?.wallet,
  //   // },
  //   onLogs: (logs) => {
  //     console.log("New approval", logs);
  //     const newApprove = logs.sort(
  //       (a, b) => Number(a.blockNumber) - Number(b.blockNumber)
  //     )[logs.length - 1];

  //     if (newApprove.transactionHash) {
  //       setTxHash(newApprove.transactionHash);
  //     }
  //   },
  // });
  return { txHash };
};
