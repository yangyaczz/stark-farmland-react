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
        </div>
    );
}

export default App;
