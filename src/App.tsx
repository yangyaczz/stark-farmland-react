import { useComponentValue } from "@dojoengine/react";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import FarmLand from './FarmLand';

function App() {
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

    const [clipboardStatus, setClipboardStatus] = useState({
        message: "",
        isError: false,
    });


    // entity id we are syncing
    // const entityId = getEntityIdFromKeys([
    //     BigInt(account?.account.address),
    // ]) as Entity;


    // const land = useComponentValue(Land, getEntityIdFromKeys([BigInt(1)]));
    // const landManager = useComponentValue(LandManager, entityId);
    // const player = useComponentValue(Player, entityId);
    // const tree = useComponentValue(Tree, entityId);
    // const treeManager = useComponentValue(TreeManager, entityId)

    // console.log("=====", land);


    const handleRestoreBurners = async () => {
        try {
            await account?.applyFromClipboard();
            setClipboardStatus({
                message: "Burners restored successfully!",
                isError: false,
            });
        } catch (error) {
            setClipboardStatus({
                message: `Failed to restore burners from clipboard`,
                isError: true,
            });
        }
    };

    useEffect(() => {
        if (clipboardStatus.message) {
            const timer = setTimeout(() => {
                setClipboardStatus({ message: "", isError: false });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [clipboardStatus.message]);


    return (
        <div>
            <button onClick={() => account?.create()}>
                {account?.isDeploying ? "deploying burner" : "create burner"}
            </button>
            {account && account?.list().length > 0 && (
                <button onClick={async () => await account?.copyToClipboard()}>
                    Save Burners to Clipboard
                </button>
            )}
            <button onClick={handleRestoreBurners}>
                Restore Burners from Clipboard
            </button>
            {clipboardStatus.message && (
                <div className={clipboardStatus.isError ? "error" : "success"}>
                    {clipboardStatus.message}
                </div>
            )}

            <div className="card">
                <div>{`burners deployed: ${account.count}`}</div>
                <div>
                    select signer:{" "}
                    <select
                        value={account ? account.account.address : ""}
                        onChange={(e) => account.select(e.target.value)}
                    >
                        {account?.list().map((account, index) => {
                            return (
                                <option value={account.address} key={index}>
                                    {account.address}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <button onClick={() => account.clear()}>
                        Clear burners
                    </button>
                    <p>
                        You will need to Authorise the contracts before you can
                        use a burner. See readme.
                    </p>
                </div>
            </div>

            {/* xxxxxxxxxx======================xxxxxxxxxxxxx===============xxxxxxxxxxxxxxxx */}



            <FarmLand />







            {/* <div className="p-6 min-h-screen flex flex-col items-center justify-center">
                <div className=" p-6 rounded-lg shadow-lg w-full max-w-md">

                    <div className="mb-2">
                        <span className="font-bold">Spawn: </span>
                        {player ? `${player.is_spawn}` : "Need to Spawn"}
                    </div>
                    <div className="mb-2">
                        <span className="font-bold">Seed Amount: </span>
                        {player ? `${Number(player.seed_amount)}` : 'xxxx'}
                    </div>
                    <div className="mb-2">
                        <span className="font-bold">Fruit Amount: </span>
                        {player ? `${Number(player.fruit_amount)}` : 'xxxx'}
                    </div>
                    <div className="mb-2">
                        <span className="font-bold">Last Help Timestamp: </span>
                        {player ? `${player.last_helped_timestamp}` : 'xxxx'}
                    </div>
                    <div className="mb-2">
                        <span className="font-bold">Last Prank Timestamp: </span>
                        {player ? `${player.last_pranked_timestamp}` : 'xxxx'}
                    </div>
                    <div className="mb-2">
                        <span className="font-bold">Tree Array: </span>
                        {player ? `${player.tree_array}` : 'xxxx'}
                    </div>
                    <div className="mb-4">
                        <span className="font-bold">Land Array: </span>
                        {player ? `${player.land_array}` : 'xxxx'}
                    </div>

                    <button
                        className="bg-black text-white py-2 px-4 rounded mb-4 w-full"
                        onClick={() => reflash(account.account)}
                    >
                        Reflash
                    </button>
                    <button
                        className="bg-black text-white py-2 px-4 rounded mb-4 w-full"
                        onClick={() => add_land(account.account)}
                    >
                        Add Land
                    </button>
                    <button
                        className="bg-black text-white py-2 px-4 rounded mb-4 w-full"
                        onClick={() => plant(account.account, 1)}
                    >
                        Plant
                    </button>
                    <button
                        className="bg-black text-white py-2 px-4 rounded mb-4 w-full"
                        onClick={() => watering_myself(account.account, 1)}
                    >
                        Watering Myself
                    </button>
                    <button
                        className="bg-black text-white py-2 px-4 rounded w-full"
                        onClick={() => watering_others(account.account, 2)}
                    >
                        Watering Others
                    </button>
                </div>
            </div> */}







            {/* <div className="">
                <button onClick={() => spawn(account.account)}>Spawn</button>
                <div>
                    spawn: {player ? `${player.is_spawn}` : "Need to Spawn"}
                </div>
                <div>
                    seed amount: {player ? `${Number(player.seed_amount)}` : 'xxxx'}
                </div>
                <div>
                    fruit amout: {player ? `${Number(player.fruit_amount)}` : 'xxxx'}
                </div>
                <div>
                    last help timestamp: {player ? `${player.last_helped_timestamp}` : 'xxxx'}
                </div>
                <div>
                    last prank timestamp: {player ? `${player.last_pranked_timestamp}` : 'xxxx'}
                </div>
                <div>
                    tree array: {player ? `${player.tree_array}` : 'xxxx'}
                </div>
                <div>
                    land array: {player ? `${player.land_array}` : 'xxxx'}
                </div>

                <button onClick={() => reflash(account.account)}>Reflash</button>
                <button onClick={() => add_land(account.account)}>Add Land</button>

                <button onClick={() => plant(account.account, 1)}>Plant</button>

                <button onClick={() => watering_myself(account.account, 1)}>watering myself</button>
                <button onClick={() => watering_others(account.account, 2)}>watering other</button>
            </div> */}

            {/* <div className="card">
                <div>
                    <button
                        onClick={() =>
                            position && position.vec.y > 0
                                ? handleMove(Direction.Up)
                                : console.log("Reach the borders of the world.")
                        }
                    >
                        Move Up
                    </button>
                </div>
                <div>
                    <button
                        onClick={() =>
                            position && position.vec.x > 0
                                ? handleMove(Direction.Left)
                                : console.log("Reach the borders of the world.")
                        }
                    >
                        Move Left
                    </button>
                    <button
                        onClick={() => handleMove(Direction.Right)}
                    >
                        Move Right
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => handleMove(Direction.Down)}
                    >
                        Move Down
                    </button>
                </div>
            </div> */}
        </div>
    );
}

export default App;
