import { AccountInterface } from "starknet";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { Direction, updatePositionWithDirection } from "../utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { ContractComponents } from "./generated/contractComponents";
import type { IWorld } from "./generated/generated";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { client }: { client: IWorld },
    _contractComponents: ContractComponents,
    { Land, LandManager, Player, Tree, TreeManager }: ClientComponents
) {
    const spawn = async (account: AccountInterface) => {
        try {
            const { transaction_hash } = await client.actions.spawn({
                account
            });

            console.log(
                await account.waitForTransaction(transaction_hash, {
                    retryInterval: 100,
                })
            );

            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (e) {
            console.log(e);
        }
    };

    const reflash = async (account: AccountInterface) => {
        try {
            const { transaction_hash } = await client.actions.reflash({
                account
            })
            console.log(
                await account.waitForTransaction(transaction_hash, {
                    retryInterval: 100,
                })
            );

            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (e) {
            console.log(e)
        }
    }

    const add_land = async (account: AccountInterface) => {
        try {
            const { transaction_hash } = await client.actions.add_land({
                account
            })
            console.log(
                await account.waitForTransaction(transaction_hash, {
                    retryInterval: 100,
                })
            );

            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (e) {
            console.log(e)
        }
    }

    const plant = async (account: AccountInterface, land_id: number) => {
        try {
            const { transaction_hash } = await client.actions.plant({
                account, land_id
            })
            console.log(
                await account.waitForTransaction(transaction_hash, {
                    retryInterval: 100,
                })
            );

            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (e) {
            console.log(e)
        }
    }

    const watering_myself = async (account: AccountInterface, tree_id: number) => {
        try {
            const { transaction_hash } = await client.actions.watering_myself({
                account, tree_id
            })
            console.log(
                await account.waitForTransaction(transaction_hash, {
                    retryInterval: 100,
                })
            );

            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (e) {
            console.log(e)
        }
    }

    const watering_others = async (account: AccountInterface, tree_id: number) => {
        try {
            const { transaction_hash } = await client.actions.watering_others({
                account, tree_id
            })
            console.log(
                await account.waitForTransaction(transaction_hash, {
                    retryInterval: 100,
                })
            );

            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (e) {
            console.log(e)
        }
    }

    const harvest = async (account: AccountInterface, land_id: number) => {
        try {
            const { transaction_hash } = await client.actions.harvest({
                account, land_id
            })
            console.log(
                await account.waitForTransaction(transaction_hash, {
                    retryInterval: 100,
                })
            );

            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (e) {
            console.log(e)
        }
    }

    const convert_fruit_to_seed = async (account: AccountInterface, fruit_amount: number) => {
        try {
            const { transaction_hash } = await client.actions.convert_fruit_to_seed({
                account, fruit_amount
            })
            console.log(
                await account.waitForTransaction(transaction_hash, {
                    retryInterval: 100,
                })
            );

            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (e) {
            console.log(e)
        }
    }



    // const move = async (account: AccountInterface, direction: Direction) => {
    //     const entityId = getEntityIdFromKeys([
    //         BigInt(account.address),
    //     ]) as Entity;

    //     const positionId = uuid();
    //     Position.addOverride(positionId, {
    //         entity: entityId,
    //         value: {
    //             player: BigInt(entityId),
    //             vec: updatePositionWithDirection(
    //                 direction,
    //                 getComponentValue(Position, entityId) as any
    //             ).vec,
    //         },
    //     });

    //     const movesId = uuid();
    //     Moves.addOverride(movesId, {
    //         entity: entityId,
    //         value: {
    //             player: BigInt(entityId),
    //             remaining:
    //                 (getComponentValue(Moves, entityId)?.remaining || 0) - 1,
    //         },
    //     });

    //     try {
    //         const { transaction_hash } = await client.actions.move({
    //             account,
    //             direction,
    //         });

    //         await account.waitForTransaction(transaction_hash, {
    //             retryInterval: 100,
    //         });

    //         console.log(
    //             await account.waitForTransaction(transaction_hash, {
    //                 retryInterval: 100,
    //             })
    //         );

    //         await new Promise((resolve) => setTimeout(resolve, 1000));
    //     } catch (e) {
    //         console.log(e);
    //         Position.removeOverride(positionId);
    //         Moves.removeOverride(movesId);
    //     } finally {
    //         Position.removeOverride(positionId);
    //         Moves.removeOverride(movesId);
    //     }
    // };

    return {
        spawn,
        reflash,
        add_land,
        plant,
        watering_myself,
        watering_others,
        harvest,
        convert_fruit_to_seed
    };
}
