import { useEffect, useState } from "react";
import categories from "./utils/categories";

const useCategoryChange = (stateCategory) => {
  const [icon, setIcon] = useState("star");
  const [hasMaxValue, setHasMaxValue] = useState(false);

  useEffect(() => {
    const currentCategory = categories.find(
      (category) => category.name == stateCategory
    );
    if (currentCategory) {
      setIcon(currentCategory.icon);
      setHasMaxValue(currentCategory.type == "nonFixed");
    }
  }, [stateCategory]);

  return [icon, hasMaxValue];
};

export default useCategoryChange;
