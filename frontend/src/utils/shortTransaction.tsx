export const shortTransaction = (transaction: string): string => {
  return `${transaction.slice(0, 6)}...${transaction.slice(-4)}`;
};
