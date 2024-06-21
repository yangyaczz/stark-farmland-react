import React, { useState, useEffect } from "react";

import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import { Entity, Has, getComponentValue } from "@dojoengine/recs";
import {
  useDynamicContext,
  useUserWallets,
} from "@dynamic-labs/sdk-react-core";
import { getChain } from "@dynamic-labs/utils";
import CartridgeConnector from "@cartridge/connector";
import { connect, disconnect } from "get-starknet";
import {
  Account,
  Chain,
  Hex,
  Transport,
  WalletClient,
  PublicClient,
  parseEther,
} from "viem";
const FarmLand: React.FC<any> = () => {
  const { primaryWallet } = useDynamicContext();

  if (!primaryWallet) return null;

  const [selectedLandId, setSelectedLandId] = useState<number>(0);
  const {
    setup: {
      systemCalls: {
        spawn,
        reflash,
        add_land,
        plant,
        watering_myself,
        watering_others,
        harvest,
        convert_fruit_to_seed,
      },
      clientComponents: { Land, LandManager, Player, Tree, TreeManager },
    },
    account,
  } = useDojo();

  // entity id we are syncing
  const playerEntityId = getEntityIdFromKeys([
    BigInt(account?.account.address),
    // BigInt(userWallets[0]?.address)
  ]) as Entity;

  console.log("entityid", playerEntityId);
  const player = useComponentValue(Player, playerEntityId);
  console.log("player", player); //null

  const land = useComponentValue(
    Land,
    getEntityIdFromKeys([BigInt(selectedLandId)])
  );
  // console.log('aaaa', land)

  const tree = useComponentValue(
    Tree,
    getEntityIdFromKeys([BigInt(land ? land.tree_id : 0)])
  );
  console.log("!!!!", tree);

  //using Cartridge
  // const connector = new CartridgeConnector([{
  //     target: userWallets[0]?.address,
  //     method: "have_turn",
  // }])
  // console.log(connector)

  //using Dynamic Wallet
//   async function sendTransaction() {
//     const provider =
//       await primaryWallet?.connector.getSigner<
//         WalletClient<Transport, Chain, Account>
//       >();

//     if (!provider) console.log("NO PROVIDER");

//     const transaction = {
//       account: primaryWallet?.address as Hex,
//       chain: getChain(await provider?.getChainId()),
//       to: "0x07d481923d7ff200c6a253c3aa0f720e83268543e15dacfd965d7447408c3839" as Hex,
//       value: 0.001 ? parseEther("0.001") : undefined,
//     };
//   }

  // reflash data (bug of dojo.js)
  const [shouldReflash, setShouldReflash] = useState(false);
  useEffect(() => {
    if (player && player.is_spawn) {
      setShouldReflash(true);
    }
  }, [player, account.account]);

  useEffect(() => {
    if (shouldReflash) {
      reflash(account.account);
      const timeoutId = setTimeout(() => {
        setShouldReflash(false);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [shouldReflash, account.account]);

  // init
  if (!player) {
    return (
      <div>
        {/* <button className="w-4 h-2 text-white bg-black" onClick={sendTransaction}>
          Connect Via StarkJS
        </button> */}

        {!player && (
          <button
            className="w-full px-4 py-2 mb-4 text-white rounded"
            onClick={() => spawn(account.account)}
          >
            CLICK HERE TO Spawn
          </button>
        )}
      </div>
    );
  }
  if (!Array.isArray(player.land_array)) {
    return <div>Loading land data or data is not available...</div>;
  }

  const landIndices = player.land_array.map((s) => parseInt(s));
  const totalLands = 15;
  const myLands = Array(totalLands).fill(false);
  landIndices.forEach((index) => {
    if (index - 1 >= 0 && index - 1 < totalLands) {
      myLands[index - 1] = true;
    }
  });

  const handleLandClick = (index: number) => {
    setSelectedLandId(index);
    console.log(`Land at index ${index} clicked.`);
  };

  function renderTreeDetails(land: any) {
    if (!land) return null;

    const treeId = Number(land.tree_id);
    if (treeId === 0) {
      return (
        <div className="flex items-center justify-center space-x-2">
          <div>land empty: </div>
          <button onClick={() => plant(account.account, selectedLandId)}>
            Plant
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <p>Tree ID: {tree && `${Number(tree.id)}`}</p>
          <p>water value: {tree && `${Number(tree.water_value)}`}</p>

          <div className="flex items-center justify-center space-x-1">
            <p>
              last water time:{" "}
              {tree && `${Number(tree.last_watered_timestamp)}`}
            </p>
            <button
              onClick={() => watering_myself(account.account, Number(tree?.id))}
            >
              watering
            </button>
          </div>

          {tree && Number(tree.is_fruited) !== 0 && (
            <button onClick={() => harvest(account.account, selectedLandId)}>
              Harvest
            </button>
          )}
        </div>
      );
    }
  }

  return (
      <div className="relative">
        <div className="grid grid-cols-5 gap-1 p-4">
          {myLands.map((myLand, index) => (
            <button
              key={index}
              onClick={() => myLand && handleLandClick(index + 1)}
              className={`w-20 h-20 ${myLand ? "bg-green-200" : "bg-green-800"} focus:outline-none`}
              disabled={!myLand}
            >
              {myLand ? "my land" : "others land"}
            </button>
          ))}
        </div>

        <div className="flex justify-center w-full p-4 mt-4 shadow-lg">
          <div className="flex items-center justify-between w-full max-w-4xl bg-black">
            {" "}
            {/* 外层容器设置最大宽度以控制大小 */}
            <div className="flex items-center justify-center w-1/2">
              <div className="p-4 text-lg font-semibold text-white bg-black">
                <h3>Player Details</h3>
                <p>seed amount: {player && `${Number(player.seed_amount)}`}</p>
                <div className="flex items-center justify-center space-x-1">
                  <p>
                    fruit amout: {player && `${Number(player.fruit_amount)}`}
                  </p>
                  <button
                    className="bg-emerald-500"
                    onClick={() => convert_fruit_to_seed(account.account, 5)}
                  >
                    convert to seed
                  </button>
                </div>
                <p>
                  last help timestamp:{" "}
                  {player && `${player.last_helped_timestamp}`}
                </p>
                <p>
                  last prank timestamp:{" "}
                  {player && `${player.last_pranked_timestamp}`}
                </p>
                <button
                  className="bg-emerald-500"
                  onClick={() => add_land(account.account)}
                >
                  Add Land
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center w-1/2">
              <div className="p-4 text-lg font-semibold text-white bg-black">
                <h3>Land Details</h3>
                <p>Land Index: {selectedLandId}</p>
                <p>
                  Owner:{" "}
                  {land &&
                    `${String(land.player).substring(0, 6)}...${String(land.player).substring(String(land.player).length - 4)}`}
                </p>
                {/* <p>Tree ID: {land && (Number(land.tree_id) === 0 ? 'empty' : `${Number(land.tree_id)}`)}</p> */}
                {renderTreeDetails(land)}
                {/* <p>Is Available: {land && (land.is_available ? 'available' : 'not available')}</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default FarmLand;
