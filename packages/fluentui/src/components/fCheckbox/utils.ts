import { DArray, getDArray } from "refina";
import type { FCheckboxState } from "./fCheckbox.r";

/**
 * @returns the mixed state if any of the sources is mixed, true if any of the sources is true and none is false, false otherwise
 */
export function calcMixedCheckboxState(
  sources: DArray<boolean | FCheckboxState>,
): FCheckboxState {
  const sourcesSet = new Set(getDArray(sources));
  return sourcesSet.has("mixed")
    ? "mixed"
    : sourcesSet.has(true)
    ? sourcesSet.has(false)
      ? "mixed"
      : true
    : false;
}
