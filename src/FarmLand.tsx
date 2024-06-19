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
    console.log('aaaa', land)


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
    const landsAvailable = Array(totalLands).fill(false);
    landIndices.forEach(index => {
        if (index - 1 >= 0 && index - 1 < totalLands) {
            landsAvailable[index - 1] = true;
        }
    });

    const handleLandClick = (index: number) => {
        setSelectedLandId(index)
        console.log(`Land at index ${index} clicked.`);
    };

    return (
        <div className='relative'>

            <div className="grid grid-cols-5 gap-1 p-4">
                {landsAvailable.map((landAvailable, index) => (
                    <button
                        key={index}
                        onClick={() => landAvailable && handleLandClick(index + 1)}
                        className={`w-20 h-20 ${landAvailable ? 'bg-green-200' : 'bg-green-800'} focus:outline-none`}
                        disabled={!landAvailable}
                    >
                        {landAvailable ? '可用' : '不可用'}
                    </button>
                ))}

            </div>


            <div className="w-full p-4 bg-black mt-4 shadow-lg">
                {selectedLandId !== 0 ? (
                    <div className="text-lg font-semibold">
                        <h3>Land Details</h3>
                        <p>Land Index: {selectedLandId}</p>
                        <p>owner: {land && `${land.player}`}</p>
                        <p>tree id: {land && (Number(land.tree_id) === 0 ? 'empty' : `${Number(land.tree_id)}`)}</p>
                        <p>Is Available: {land && (land.is_available ? 'available' : 'not available')}</p>
                    </div>
                ) : (
                    <div className="text-lg font-semibold">
                        <h3>Select a land to see details</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FarmLand;
