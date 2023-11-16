export const createTransferTxURL = (contractAddress, recipientAddress, amount, chainId=1) => {
  const amountFormatted = amount.toExponential().replace('+', '');
  return `ethereum:${contractAddress}@${chainId}/transfer?address=${recipientAddress}&uint256=${amountFormatted}`;
}
