import { setColorScheme } from "mdui";
import type { CustomColor } from "mdui/functions/utils/colorScheme";
import { $contextFunc } from "refina";

let currentColorSchemeHex: string = "$unset";

export const useMdColorScheme = $contextFunc(
  () => (hex: string, customColors?: CustomColor[]) => {
    if (hex !== currentColorSchemeHex || customColors) {
      setColorScheme(hex, { customColors });
      currentColorSchemeHex = hex;
    }
  },
);
