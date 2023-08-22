import { Context, contextFuncs } from "../context";
import { D, OutputComponent, OutputComponentContext, getD, outputComponent } from "../lib";

@outputComponent("rIcon")
export class RIcon extends OutputComponent {
  main(_: OutputComponentContext<this>, name: D<string>) {
    _.span(`[${name}]`);
  }
}

declare module "../component/index" {
  interface OutputComponents {
    rIcon: RIcon;
  }
}

// export const rPrependIconSymbol = Symbol("rPrependIcon"),
//   rAppendIconSymbol = Symbol("rAppendIcon");

// contextFuncs.rPrependIcon = function (this: Context, ckey: string, name: D<string>, stacked: D<boolean> = false) {
//   this.$provide(rPrependIconSymbol, { name, stacked: getD(stacked) });
// };
// contextFuncs.rAppendIcon = function (this: Context, ckey: string, name: D<string>, stacked: D<boolean> = false) {
//   this.$provide(rAppendIconSymbol, { name, stacked: getD(stacked) });
// };

// declare module "../context" {
//   interface CustomContext<C> {
//     rPrependIcon: (name: D<string>, stacked?: D<boolean>) => void;
//     rAppendIcon: (name: D<string>, stacked?: D<boolean>) => void;
//   }
// }
