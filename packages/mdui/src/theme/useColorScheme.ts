import { setColorScheme } from "mdui";
import type { CustomColor } from "mdui/functions/utils/colorScheme";
import MdUI from "../plugin";

let currentColorSchemeHex: string = "$unset";

MdUI.registerFunc(
  "useColorScheme",
  function (_ckey, hex: string, customColors?: CustomColor[]) {
    if (hex !== currentColorSchemeHex || customColors) {
      setColorScheme(hex, { customColors });
      currentColorSchemeHex = hex;
    }
  },
);

declare module "refina" {
  interface ContextFuncs<C> {
    useColorScheme: never extends C["enabled"]
      ? (hex: string, customColors?: CustomColor[]) => void
      : never;
  }
}
