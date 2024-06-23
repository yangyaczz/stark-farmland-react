import { useComponentValue } from "@dojoengine/react";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { useEffect, useState, useRef, ReactChildren, ReactNode } from "react";
import "./App.css";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import FarmLand from "./FarmLand";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { connect, disconnect } from "get-starknet";
import { config } from "process";
import { setup } from "./dojo/generated/setup";
import { dojoConfig } from "../dojoConfig";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { Loading } from "./Loading.tsx";

function SetConfigProvider({ children }: { children: ReactNode }) {
  const { primaryWallet } = useDynamicContext();

  console.log(primaryWallet)
  async function onload() {
    if (!primaryWallet) return null;

    // let config = {
    //   ...dojoConfig,
    //   masterAddress: primaryWallet,
    // };
    // const setupResult = await setup(config);
  }

  onload();

      <DojoProvider value={setupResult}>
  return 
  {children}
  </DojoProvider>
}

export default SetConfigProvider;
