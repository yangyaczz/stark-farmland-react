import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setup } from "./dojo/generated/setup.ts";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { dojoConfig } from "../dojoConfig.ts";
import { Loading } from "./Loading.tsx";
import {
  DynamicContextProvider,
  DynamicWidget,
  FilterChain,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { StarknetWalletConnectors } from "@dynamic-labs/starknet";
import { StarknetIcon, EthereumIcon } from "@dynamic-labs/iconic";
async function init() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("React root not found");

  console.log('main')
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  const setupResult = await setup(dojoConfig);

  !setupResult && <Loading />;

  const DYNAMIC_WALLET_ENV_ID = "2ee647a9-e101-4ea2-a4f7-cad6a4366958";
  const EthWallets = {
    label: { icon: <EthereumIcon /> },
    walletsFilter: FilterChain("EVM"),
  };

  const StarkWallets = {
    label: { icon: <StarknetIcon /> },
    walletsFilter: FilterChain("STARK"),
  };

  // const provider = publicProvider();
  root.render(
    <React.StrictMode>
      {/* <StarknetConfig chains={chains} provider={provider} connectors={connectors}> */}
      <DojoProvider value={setupResult}>
        <DynamicContextProvider
          settings={{
            environmentId: DYNAMIC_WALLET_ENV_ID,
            walletConnectors: [
              StarknetWalletConnectors,
              EthereumWalletConnectors,
            ],
            overrides: {
              views: [
                {
                  type: "wallet-list",
                  tabs: {
                    items: [EthWallets, StarkWallets],
                  },
                },
              ],
            },
          }}
        >
          <div className="w-full h-screen bg-[url('/src/assets/bg-tree2.png')] bg-cover bg-repeat flex justify-center items-center">
            <div className="w-11/12 h-[80px] flex justify-start items-center absolute top-0 transform -translate-x-1/2 left-1/2 px-6 gap-5 bg-yellow-600/80 rounded-xl">
              <img src="/src/assets/logo.png" alt="logo" width={75} height={75}/>
              <p className="px-2 text-lg text-yellow-800 bg-white rounded-2xl w-[121px] cursor-pointer">Game</p>
              <p className="px-2 text-lg text-yellow-800 bg-white rounded-2xl w-[121px] cursor-pointer">Players</p>
              <p className="px-2 text-lg text-yellow-800 bg-white rounded-2xl w-[121px] cursor-pointer">Dashboard</p>
              <div className="ml-auto ">
              <DynamicWidget/>
              </div>
            </div>
            <App />
          </div>
        </DynamicContextProvider>
      </DojoProvider>
      {/* </StarknetConfig> */}
    </React.StrictMode>
  );
}

init();
