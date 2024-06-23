import React from "react";

import { useComponentValue } from "@dojoengine/react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";

const LandStage: React.FC<any> = ({handleLandClick, myIndexedLand}) => {

  const {
    setup: {
      clientComponents: { Land, Tree },
    },
  } = useDojo();

  const land = useComponentValue(
    Land,
    getEntityIdFromKeys([BigInt(myIndexedLand)])
  );

  const tree = useComponentValue(
    Tree,
    getEntityIdFromKeys([BigInt(land ? land.tree_id : 0)])
  );

  return (
    <button
      onClick={() => handleLandClick(parseInt(myIndexedLand))}
      className={` w-32 h-32 bg-green-200 focus:outline-none bg-contain 
            ${tree?.water_value === null || tree?.water_value === undefined ? "bg-[url('/src/assets/emptyland.jpg')]" : ""}
            ${tree?.water_value >= 0 && tree?.water_value < 20 ? "bg-[url('/src/assets/seed.webp')]" : ""}
            ${tree?.water_value >= 20 && tree?.water_value < 60 ? "bg-[url('/src/assets/seedling.webp')]" : ""}
            ${tree?.water_value >= 60 && tree?.water_value < 100 ? "bg-[url('/src/assets/blossomTree.webp')]" : ""}
            ${tree?.water_value >= 100 ? "bg-[url('/src/assets/fruitTree.webp')]" : ""}
            `}
    ></button>
  );
};

export default LandStage;
