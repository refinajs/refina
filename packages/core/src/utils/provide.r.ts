import { OutputComponent } from "../component";
import { Prelude } from "../constants";
import { Context } from "../context";
import { D } from "../data";
import { EmbededContent } from "./embed.r";

@Prelude.outputComponent("provide")
export class Provide extends OutputComponent {
  main<Args extends any[]>(_: Context, key: symbol, value: any, content: D<EmbededContent<Args>>, ...args: Args): void;
  main<Args extends any[]>(_: Context, obj: Record<symbol, any>, content: D<EmbededContent<Args>>, ...args: Args): void;
  main<Args extends any[]>(
    _: Context,
    keyOrObj: symbol | Record<symbol, any>,
    contentOrValue: any,
    content: D<EmbededContent<Args>>,
    ...args: Args
  ): void {
    if (typeof keyOrObj === "symbol") {
      const key = keyOrObj,
        value = contentOrValue;
      const oldVal = _.$runtimeData[key];
      _.$runtimeData[key] = value;
      _.embed(content, ...args);
      _.$runtimeData[key] = oldVal;
    } else {
      const obj = keyOrObj;
      const symbols = Object.getOwnPropertySymbols(obj);
      const oldVals: Record<symbol, any> = {};
      for (const key of symbols) {
        oldVals[key] = _.$runtimeData[key];
        _.$runtimeData[key] = obj[key];
      }
      _.embed(content, ...args);
      for (const key of symbols) {
        _.$runtimeData[key] = oldVals[key];
      }
    }
  }
}

declare module "../context" {
  interface ContextFuncs<C> {
    provide: Provide extends C["enabled"]
      ? (<Args extends any[]>(key: symbol, value: any, content: D<EmbededContent<Args>>, ...args: Args) => void) &
          (<Args extends any[]>(obj: Record<symbol, any>, content: D<EmbededContent<Args>>, ...args: Args) => void)
      : never;
  }
}
