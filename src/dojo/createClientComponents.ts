import { overridableComponent } from "@dojoengine/recs";
import { ContractComponents } from "./generated/contractComponents";

export type ClientComponents = ReturnType<typeof createClientComponents>; 

export function createClientComponents({
    contractComponents,
}: {
    contractComponents: ContractComponents;
}) {
    return {
        ...contractComponents,
        // Position: overridableComponent(contractComponents.Position),
        // Moves: overridableComponent(contractComponents.Moves),
        Land: overridableComponent(contractComponents.Land),
        LandManager: overridableComponent(contractComponents.LandManager),
        Player: overridableComponent(contractComponents.Player),
        Tree: overridableComponent(contractComponents.Tree),
        TreeManager: overridableComponent(contractComponents.TreeManager),
    };
}
