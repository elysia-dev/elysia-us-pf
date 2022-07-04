import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";
import Account from "../components/Account";
import "../styles/globals.css";
import getLibrary from "../utils/getLibrary";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Account />
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}

export default MyApp;
