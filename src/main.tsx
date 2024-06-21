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
import ControllerConnector from "@cartridge/connector";
async function init() {
const connector = new ControllerConnector()
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("React root not found");

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

  root.render(
    <React.StrictMode>
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
            <DynamicWidget />
          <App />
        </DynamicContextProvider>
      </DojoProvider>
    </React.StrictMode>
  );
}

init();
