export const shortTransaction = (transaction: string): string => {
  return `${transaction.slice(0, 4)}...${transaction.slice(-4)}`;
};
