import manifest from "../stark-farmland/manifests/dev/manifest.json";
import { createDojoConfig } from "@dojoengine/core";

export const dojoConfig = createDojoConfig({
    manifest,
    // toriiUrl: "http://0.0.0.0:8080",
    toriiUrl: "https://api.cartridge.gg/x/farmlandtest/torii",
    rpcUrl: "https://api.cartridge.gg/x/farmlandtest/katana",

    masterAddress: "0x55394e7e41cfa72bc185cfaae17b46125ab2e35d146b45d2f27f4438ecf4be5",
    masterPrivateKey: "0x188b9005f79d818d311ca607940b10a674fb78671c7bd496b28c06c14db9e32",
})