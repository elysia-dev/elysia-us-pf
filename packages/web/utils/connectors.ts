import { InjectedConnector } from "@web3-react/injected-connector";
export const injectedConnector = new InjectedConnector({
  // 1: mainnet
  // 5: goerli
  supportedChainIds: [1, 3, 4, 5],
});

export default injectedConnector;
