import React, { useState, useEffect } from 'react';

import { useComponentValue } from "@dojoengine/react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import { Entity, getComponentValue } from "@dojoengine/recs";


const FarmLand: React.FC<any> = ({ }) => {

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
                convert_fruit_to_seed },
            clientComponents: { Land, LandManager, Player, Tree, TreeManager },
        },
        account,
    } = useDojo();



    // entity id we are syncing
    const playerEntityId = getEntityIdFromKeys([
        BigInt(account?.account.address),
    ]) as Entity;
    const player = useComponentValue(Player, playerEntityId);

    const land = useComponentValue(Land, getEntityIdFromKeys([BigInt(selectedLandId)]));
    // console.log('aaaa', land)

    const tree = useComponentValue(Tree, getEntityIdFromKeys([BigInt((land ? land.tree_id : 0))]))
    console.log('!!!!', tree)




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
        return <div>
            {!player && (
                <button
                    className="text-white py-2 px-4 rounded mb-4 w-full"
                    onClick={() => spawn(account.account)}
                >
                    CLICK HERE TO Spawn
                </button>
            )}
        </div>
    }
    if (!Array.isArray(player.land_array)) {
        return <div>Loading land data or data is not available...</div>;
    }



    const landIndices = player.land_array.map(s => parseInt(s));
    const totalLands = 15;
    const myLands = Array(totalLands).fill(false);
    landIndices.forEach(index => {
        if (index - 1 >= 0 && index - 1 < totalLands) {
            myLands[index - 1] = true;
        }
    });


    const handleLandClick = (index: number) => {
        setSelectedLandId(index)
        console.log(`Land at index ${index} clicked.`);
    };

    function renderTreeDetails(land: any) {
        if (!land) return null;

        const treeId = Number(land.tree_id);
        if (treeId === 0) {
            return (
                <div className='flex justify-center items-center space-x-2'>
                    <div>land empty: </div>
                    <button onClick={() => plant(account.account, selectedLandId)}>Plant</button>
                </div>
            );
        } else {
            return (
                <div>
                    <p>Tree ID: {tree && `${Number(tree.id)}`}</p>
                    <p>water value: {tree && `${Number(tree.water_value)}`}</p>

                    <div className='flex justify-center items-center space-x-1'>
                        <p>last water time: {tree && `${Number(tree.last_watered_timestamp)}`}</p>
                        <button onClick={() => watering_myself(account.account, Number(tree?.id))}>watering</button>
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
        <div className='relative'>
            <div className="grid grid-cols-5 gap-1 p-4">
                {myLands.map((myLand, index) => (
                    <button
                        key={index}
                        onClick={() => myLand && handleLandClick(index + 1)}
                        className={`w-20 h-20 ${myLand ? 'bg-green-200' : 'bg-green-800'} focus:outline-none`}
                        disabled={!myLand}
                    >
                        {myLand ? 'my land' : 'others land'}
                    </button>
                ))}
            </div>


            <div className="w-full p-4 mt-4 shadow-lg flex justify-center">
                <div className="flex justify-between items-center w-full max-w-4xl bg-black"> {/* 外层容器设置最大宽度以控制大小 */}
                    <div className="w-1/2 flex justify-center items-center">
                        <div className="text-lg font-semibold text-white bg-black p-4">
                            <h3>Player Details</h3>
                            <p>seed amount: {player && `${Number(player.seed_amount)}`}</p>
                            <div className='flex justify-center items-center space-x-1'>
                                <p>fruit amout: {player && `${Number(player.fruit_amount)}`}</p>
                                <button onClick={() => convert_fruit_to_seed(account.account, 5)}>convert to seed</button>
                            </div>
                            <p>last help timestamp: {player && `${player.last_helped_timestamp}`}</p>
                            <p>last prank timestamp: {player && `${player.last_pranked_timestamp}`}</p>
                            <button onClick={() => add_land(account.account)}>Add Land</button>
                        </div>
                    </div>



                    <div className="w-1/2 flex justify-center items-center">
                        <div className="text-lg font-semibold text-white bg-black p-4">
                            <h3>Land Details</h3>
                            <p>Land Index: {selectedLandId}</p>
                            <p>Owner: {land && `${(String(land.player)).substring(0, 6)}...${(String(land.player)).substring((String(land.player)).length - 4)}`}</p>
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
