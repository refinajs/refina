import MagicString, { SourceMapOptions } from "magic-string";
import patterns from "./patterns";

type CtxFuncCall = (
  | {
      type: "t";
      content: string;
    }
  | {
      type: "c";
      name: string;
    }
) & {
  matchStart: number;
  matchEnd: number;
  ckey?: string;
};

export class RefinaTransformer {
  ckeyPrefix = "";

  laskFileKey = 0;
  transformedFiles = new Map<
    string,
    {
      key: string;
      src: string;
      calls: CtxFuncCall[];
      lastIndex: number;
    }
  >();

  protected toFileKey(id: number) {
    return id.toString(36).toUpperCase();
  }

  protected toCkey(fileKey: string, callId: number) {
    return `${this.ckeyPrefix}${fileKey}-${callId.toString(36).toUpperCase()}`;
  }

  isSameCall(a: CtxFuncCall, b: CtxFuncCall) {
    return (
      (a.type === "t" && b.type === "t") ||
      (a.type === "c" && b.type === "c" && a.name === b.name)
    );
  }

  transformCall(s: MagicString, call: CtxFuncCall) {
    const { matchStart, matchEnd, ckey } = call;
    if (call.type === "t") {
      s.update(matchStart, matchEnd, `_.$$t("${ckey}", \`${call.content}\`)`);
    } else {
      s.update(
        matchStart,
        matchEnd,
        call.name === "t"
          ? `_.$$t("${ckey}",`
          : `_.$$("${call.name}", "${ckey}",`,
      );
    }
  }

  transformNewFile(s: MagicString, calls: CtxFuncCall[], fileKey: string) {
    let index = 0;
    for (const call of calls) {
      call.ckey = this.toCkey(fileKey, ++index);
      this.transformCall(s, call);
    }
    return index;
  }

  updateTransformedFile(
    s: MagicString,
    calls: CtxFuncCall[],
    fileKey: string,
    oldSrc: string,
    oldCalls: CtxFuncCall[],
    lastIndex: number,
  ) {
    const minCallsNum = Math.min(calls.length, oldCalls.length);

    let changeStart: number | null = null;
    for (let i = 0; i < minCallsNum; i++) {
      const call = calls[i];
      const oldCall = oldCalls[i];
      if (
        this.isSameCall(call, oldCall) &&
        call.matchStart === oldCall.matchStart
      ) {
        call.ckey = oldCall.ckey;
        this.transformCall(s, call);
      } else {
        changeStart = i;
        break;
      }
    }

    let changeEnd: undefined | number;

    if (changeStart === null) {
      if (calls.length !== oldCalls.length) {
        changeStart = minCallsNum;
        changeEnd = undefined;
      } else {
        return lastIndex;
      }
    } else {
      const srcLen = s.original.length;
      const oldSrcLen = oldSrc.length;

      const maxChangeEnd = minCallsNum - changeStart;
      changeEnd = -maxChangeEnd;
      for (let i = 1; i <= maxChangeEnd; i++) {
        const call = calls.at(-i)!;
        const oldCall = oldCalls.at(-i)!;
        if (
          this.isSameCall(call, oldCall) &&
          srcLen - call.matchEnd === oldSrcLen - oldCall.matchEnd
        ) {
          call.ckey = oldCall.ckey;
          this.transformCall(s, call);
        } else {
          changeEnd = i === 1 ? undefined : -i + 1;
          break;
        }
      }
    }

    let index = lastIndex;
    for (const call of calls.slice(changeStart, changeEnd)) {
      call.ckey = this.toCkey(fileKey, ++index);
      this.transformCall(s, call);
    }

    return index;
  }

  transformFile(fileName: string, src: string, ignoreTransformed: boolean) {
    const transformed = this.transformedFiles.get(fileName);
    const sourceMapOptions: SourceMapOptions = {
      source: fileName,
      includeContent: true,
    };
    const calls = searchCtxFuncCalls(src);
    if (calls.length === 0) {
      return null;
    }
    let key: string;
    const s = new MagicString(src);
    if (ignoreTransformed || !transformed) {
      key = this.toFileKey(this.laskFileKey++);
      const lastIndex = this.transformNewFile(s, calls, key);

      this.transformedFiles.set(fileName, {
        key,
        src,
        calls,
        lastIndex,
      });
    } else {
      key = transformed.key;
      const {
        src: oldSrc,
        calls: oldCalls,
        lastIndex: oldLastIndex,
      } = transformed;

      const lastIndex = this.updateTransformedFile(
        s,
        calls,
        key,
        oldSrc,
        oldCalls,
        oldLastIndex,
      );
      this.transformedFiles.set(fileName, {
        key,
        src,
        calls,
        lastIndex,
      });
    }
    return {
      key,
      code: s.toString(),
      map: s.generateMap(sourceMapOptions),
    };
  }
}

export function searchCtxFuncCalls(src: string): CtxFuncCall[] {
  const calls: CtxFuncCall[] = [];
  for (const match of src.matchAll(patterns.TEXT_NODE_TAGFUNC)) {
    const matchStart = match.index!;
    const matchEnd = matchStart + match[0].length;
    calls.push({
      type: "t",
      content: match[1],
      matchStart,
      matchEnd,
    });
  }
  for (const match of src.matchAll(patterns.COMPONENT_FUNC)) {
    const matchStart = match.index!;
    const matchEnd = matchStart + match[0].length;
    calls.push({
      type: "c",
      name: match[1],
      matchStart,
      matchEnd,
    });
  }
  calls.sort((a, b) => a.matchStart - b.matchStart);
  return calls;
}

export function transformFragment(
  src: string,
  generateCkey: (callIndex: number) => string,
) {
  let lastKey = 0;
  src = src.replaceAll(patterns.TEXT_NODE_TAGFUNC, (_, text) => {
    const ckey = generateCkey(lastKey++);
    return `_.$$t("${ckey}", \`${text}\`)`;
  });
  src = src.replaceAll(patterns.COMPONENT_FUNC, (_, name) => {
    const ckey = generateCkey(lastKey++);
    return name === "t" ? `_.$$t("${ckey}",` : `_.$$("${name}", "${ckey}",`;
  });
  return lastKey === 0 ? null : src;
}

export { patterns };
