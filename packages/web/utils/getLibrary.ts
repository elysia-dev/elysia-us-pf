import { providers } from "ethers";

export default function getLibrary(
  provider: providers.ExternalProvider | providers.JsonRpcFetchFunc
): providers.Web3Provider {
  return new providers.Web3Provider(provider);
}
