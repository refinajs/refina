import { D, getD } from "refina";
import { FCheckboxState } from ".";

/**
 * @returns the mixed state if any of the sources is mixed, true if any of the sources is true and none is false, false otherwise
 */
export function calcMixedCheckboxState(
  sources: D<D<boolean | FCheckboxState>[]>,
): FCheckboxState {
  const sourcesSet = new Set(getD(sources).map(getD));
  return sourcesSet.has("mixed")
    ? "mixed"
    : sourcesSet.has(true)
    ? sourcesSet.has(false)
      ? "mixed"
      : true
    : false;
}