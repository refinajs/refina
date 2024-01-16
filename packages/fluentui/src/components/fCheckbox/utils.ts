import type { FCheckboxState } from "./fCheckbox";

/**
 * @returns the mixed state if any of the sources is mixed, true if any of the sources is true and none is false, false otherwise
 */
export function calcMixedCheckboxState(
  sources: (boolean | FCheckboxState)[],
): FCheckboxState {
  const sourcesSet = new Set(sources);
  return sourcesSet.has("mixed")
    ? "mixed"
    : sourcesSet.has(true)
    ? sourcesSet.has(false)
      ? "mixed"
      : true
    : false;
}
