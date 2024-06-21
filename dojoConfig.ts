import manifest from "../stark-farmland/manifests/dev/manifest.json";
import { createDojoConfig } from "@dojoengine/core";

export const dojoConfig = createDojoConfig({
    manifest,
    toriiUrl: "http://localhost:8080",
    rpcUrl:"https://free-rpc.nethermind.io/sepolia-juno/v0_6"
    
});
