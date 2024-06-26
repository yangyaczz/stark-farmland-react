/* Autogenerated file. Do not edit manually. */

import { Account, AccountInterface } from "starknet";
import { DojoProvider } from "@dojoengine/core";
import { Direction } from "../../utils";

export type IWorld = Awaited<ReturnType<typeof setupWorld>>;

export interface MoveProps {
    account: Account | AccountInterface;
    direction: Direction;
}

export async function setupWorld(provider: DojoProvider) {
    function actions() {
        const spawn = async ({ account }: { account: AccountInterface }) => {
            try {
                return await provider.execute(account, {
                    contractName: "actions",
                    entrypoint: "spawn",
                    calldata: [],
                });
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };

        const reflash = async ({ account }: { account: AccountInterface }) => {
            try {
                return await provider.execute(account, {
                    contractName: "actions",
                    entrypoint: "reflash",
                    calldata: [],
                });
            } catch (error) {
                console.error("Error executing reflash:", error);
                throw error;
            }
        };

        const add_land = async({account} : {account: AccountInterface}) => {
            try {
                return await provider.execute(account, {
                    contractName: "actions",
                    entrypoint: "add_land",
                    calldata: [],
                });
            } catch (error) {
                console.error("Error executing add_land:", error);
                throw error;
            }
        }

        const plant = async({account, land_id} : any) => {
            try {
                return await provider.execute(account, {
                    contractName: "actions",
                    entrypoint: "plant",
                    calldata: [land_id]
                })
            } catch (error) {
                console.error("Error executing plant:", error);
                throw error;
            }
        }

        const watering_myself = async({account, tree_id} : any) => {
            try {
                return await provider.execute(account, {
                    contractName: "actions",
                    entrypoint: "watering_myself",
                    calldata: [tree_id]
                })
            } catch (error) {
                console.error("Error executing watering_myself:", error);
                throw error;
            }
        }

        const watering_others = async({account, tree_id} : any) => {
            try {
                return await provider.execute(account, {
                    contractName: "actions",
                    entrypoint: "watering_others",
                    calldata: [tree_id]
                })
            } catch (error) {
                console.error("Error executing watering_others:", error);
                throw error;
            }
        }

        const harvest = async({account, land_id} : any) => {
            try {
                return await provider.execute(account, {
                    contractName: "actions",
                    entrypoint: "harvest",
                    calldata: [land_id]
                })
            } catch (error) {
                console.error("Error executing harvest:", error);
                throw error;
            }
        }

        const convert_fruit_to_seed = async({account, fruit_amount} : any) => {
            try {
                return await provider.execute(account, {
                    contractName: "actions",
                    entrypoint: "convert_fruit_to_seed",
                    calldata: [fruit_amount]
                })
            } catch (error) {
                console.error("Error executing convert_fruit_to_seed:", error);
                throw error;
            }
        }

        // const move = async ({ account, direction }: MoveProps) => {
        //     try {
        //         return await provider.execute(account, {
        //             contractName: "actions",
        //             entrypoint: "move",
        //             calldata: [direction],
        //         });
        //     } catch (error) {
        //         console.error("Error executing move:", error);
        //         throw error;
        //     }
        // };
        return { spawn,
            reflash,
            add_land,
            plant,
            watering_myself,
            watering_others,
            harvest,
            convert_fruit_to_seed
            
        };
    }
    return {
        actions: actions(),
    };
}
