import React, { useState, useEffect } from "react";

import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import { Entity, Has, getComponentValue } from "@dojoengine/recs";
import {
  useDynamicContext,
  useUserWallets,
} from "@dynamic-labs/sdk-react-core";
import { format } from "date-fns";
import LandStage from "./LandStage";

const FarmLand: React.FC<any> = () => {
  const { primaryWallet } = useDynamicContext();
  const [selectedLandId, setSelectedLandId] = useState<number>(0);
  const [shouldReflash, setShouldReflash] = useState(false);
  const [showMyLand, setShowMyLand] = useState(true);
  const [otherTreeGrowthValue, setOtherTreeGrowthValue] = useState(55);
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

  const player = useComponentValue(Player, playerEntityId);

  const land = useComponentValue(
    Land,
    getEntityIdFromKeys([BigInt(selectedLandId)])
  );

  const tree = useComponentValue(
    Tree,
    getEntityIdFromKeys([BigInt(land ? land.tree_id : 0)])
  );

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

  if (!primaryWallet) return null;

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
  const totalLands = 30;
  const myLands = Array(totalLands).fill(false);
  landIndices.forEach((index) => {
    if (index - 1 >= 0 && index - 1 < totalLands) {
      myLands[index - 1] = true;
    }
  });

  const otherPlayersLand = Array.from({ length: 1 }, (v, k) => k + 30);

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
          <button
            className="bg-emerald-500"
            onClick={() => {
              plant(account.account, selectedLandId);
            }}
          >
            Plant
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <p className="text-left">Tree ID: {tree && `${Number(tree.id)}`}</p>
          <p className="text-left">
            Growth value: {tree && `${Number(tree.water_value)}`}
          </p>
          <p className="text-left">
            Last Water Time:{" "}
            {tree &&
              `${format(new Date(Number(tree.last_watered_timestamp)), "EE, p")}`}
          </p>
          <button
            className="bg-emerald-500"
            onClick={() => watering_myself(account.account, Number(tree?.id))}
          >
            Watering
          </button>

          {tree && Number(tree.is_fruited) !== 0 && (
            <button
              className="ml-4 bg-emerald-500"
              onClick={() => harvest(account.account, selectedLandId)}
            >
              Harvest
            </button>
          )}
        </div>
      );
    }
  }

  function renderOtherPlayersTreeDetails() {
    return (
      <div>
        <p className="text-left">Tree ID: {`${otherPlayersLand[0]}`}</p>
        <p className="text-left">
          Growth value: { otherTreeGrowthValue }
        </p>
        <button
          className="bg-emerald-500"
          onClick={() => setOtherTreeGrowthValue((val) => val + 5)}
        >
          Watering
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-[960px] grid grid-cols-[3fr,7fr] h-[600px] bg-white rounded-2xl ">
      <div className="flex flex-col items-center justify-around bg-[url('/src/assets/farmerTheme.webp')] bg-opacity-55 bg-contain rounded-l-2xl">
        {" "}
        {/* 外层容器设置最大宽度以控制大小 */}
        <div className="flex items-center justify-center w-full py-3 bg-zinc-800/50">
          <div className="p-2 text-lg font-semibold text-white ">
            <h3>Player Details</h3>
            <p className="text-left ">
              Seed Amount: {player && `${Number(player.seed_amount)}`}
            </p>
            <p className="text-left">
              Fruit Amout: {player && `${Number(player.fruit_amount)}`}
            </p>
            <p className="text-left ">
              Last Help:{" "}
              {player &&
                `${format(new Date(Number(player.last_helped_timestamp)), "EE,p")}`}
            </p>
            <p className="text-left ">
              Last Prank :
              {player &&
                `${format(new Date(Number(player.last_pranked_timestamp)), "EE,p")}`}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                className="p-2 bg-emerald-500 w-[100px] h-[50px] text-sm"
                onClick={() => convert_fruit_to_seed(account.account, 5)}
              >
                Convert To Seeds
              </button>
              <button
                className="p-2 bg-emerald-500  w-[100px] h-[50px] text-base"
                onClick={() => add_land(account.account)}
              >
                Add Land
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full py-3 bg-zinc-800/50">
          <div className="px-2 text-lg font-semibold text-white ">
            <h3>Land Details</h3>
            <p className="text-left ">Land Index: {selectedLandId}</p>
            <p className="text-left ">
              Owner:{!showMyLand && "0x003...56aaf"}
              {showMyLand &&land && 
                `${String(land.player).substring(0, 6)}...${String(land.player).substring(String(land.player).length - 4)}`}
            </p>
            <p className="text-left">
              Stage:
              {tree?.water_value === null ||
                (tree?.water_value === undefined && "Uncultivated")}
              {tree?.water_value >= 0 && tree?.water_value < 20 && "Seed"}
              {tree?.water_value >= 20 && tree?.water_value < 60 && "Seedling"}
              {tree?.water_value >= 60 && tree?.water_value < 100 && "Blossom"}
              {tree?.water_value >= 100 && "Mature"}
            </p>
            {showMyLand ? renderTreeDetails(land) : renderOtherPlayersTreeDetails()}
          </div>
        </div>
      </div>

      <div className="relative">
        <p className="pt-2 text-2xl font-bold text-left pl-11 ">
          {" "}
          {showMyLand ? "My Land" : "0x003...56aaf's Land"}{" "}
        </p>

        <div className="grid grid-cols-4 gap-1 p-4 place-items-center">
          {showMyLand
            ? landIndices.map((myIndexedLand) => (
                <LandStage
                  key={myIndexedLand}
                  handleLandClick={handleLandClick}
                  myIndexedLand={myIndexedLand}
                />
              ))
            : otherPlayersLand.map((otherIndexedLand) => (
                <button
                  onClick={() => handleLandClick(otherIndexedLand)}
                  className={` w-32 h-32 bg-green-200 focus:outline-none bg-contain 
                    ${otherTreeGrowthValue === null || otherTreeGrowthValue === undefined ? "bg-[url('/src/assets/emptyland.jpg')]" : ""}
                    ${otherTreeGrowthValue >= 0 && otherTreeGrowthValue < 20 ? "bg-[url('/src/assets/seed.webp')]" : ""}
                    ${otherTreeGrowthValue >= 20 && otherTreeGrowthValue < 60 ? "bg-[url('/src/assets/seedling.webp')]" : ""}
                    ${otherTreeGrowthValue >= 60 && otherTreeGrowthValue < 100 ? "bg-[url('/src/assets/blossomTree.webp')]" : ""}
                    ${otherTreeGrowthValue >= 100 ? "bg-[url('/src/assets/fruitTree.webp')]" : ""}
                    `}
                ></button>
              ))}
          {showMyLand && (
            <div
              className={`w-32 h-32 bg-contain bg-[url('/src/assets/uncultivatedLand.webp')] rounded-lg`}
            >
              <button
                onClick={() => add_land(account.account)}
                className={`w-full h-full bg-zinc-400/50 text-white font-bold`}
              >
                Add Land
              </button>
            </div>
          )}
        </div>

        {showMyLand ? (
          <button
            onClick={() => {
              setShowMyLand(false);
            }}
            className="absolute right-0 p-0 text-3xl font-bold text-white transform -translate-y-1/2 rounded-full top-1/2 w-14 h-14 bg-zinc-800/20 hover:bg-zinc-800/55"
          >
            {">"}
          </button>
        ) : (
          <button
            onClick={() => {
              setShowMyLand(true);
            }}
            className="absolute left-0 p-0 text-3xl font-bold text-white transform -translate-y-1/2 rounded-full top-1/2 w-14 h-14 bg-zinc-800/20 hover:bg-zinc-800/55"
          >
            {"<"}
          </button>
        )}
      </div>
    </div>
  );
};

export default FarmLand;
