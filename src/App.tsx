import { useComponentValue } from "@dojoengine/react";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import "./App.css";
// import { Direction } from "./utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";

function App() {
    const {
        setup: {
            systemCalls: { spawn , reflash ,  add_land},
            clientComponents: { Land, LandManager, Player, Tree, TreeManager },
        },
        account,
    } = useDojo();

    const [clipboardStatus, setClipboardStatus] = useState({
        message: "",
        isError: false,
    });

    // entity id we are syncing
    const entityId = getEntityIdFromKeys([
        BigInt(account?.account.address),
    ]) as Entity;

    const land = useComponentValue(Land, entityId);
    const landManager = useComponentValue(LandManager, entityId);
    const player = useComponentValue(Player, entityId);
    const tree = useComponentValue(Tree, entityId);
    const treeManager = useComponentValue(TreeManager, entityId)

    console.log("=====",player);

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
        <>
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

            <div className="card">
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


                {/* <div>
                    Position:{" "}
                    {position
                        ? `${position?.vec.x}, ${position?.vec.y}`
                        : "Need to Spawn"}
                </div> */}

                {/* <div>{moves && moves.last_direction}</div> */}
            </div>

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
        </>
    );
}

export default App;
