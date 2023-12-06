import MagicString, { SourceMapOptions } from "magic-string";
import {
  COMPONENT_FUNC,
  COMPONENT_FUNC_WITH_TYPE_PARAMS,
  TEXT_NODE_TAGFUNC,
} from "./patterns";

export class RefinaTransformer {
  currentFileId = 0;
  fileKeys = new Map<string, string>();

  toFileKey(id: number) {
    return id.toString(36).toUpperCase();
  }
  toCkey(fileKey: string, callId: number) {
    return `${fileKey}-${callId.toString(36).toUpperCase()}`;
  }

  shouldTransform(fileName: string) {
    return (
      /\.r(\.(test|spec))?\.[tj]s$/i.test(fileName) ||
      fileName.includes("/.vite/deps/") // The dependencies pre-bundled by Vite
    );
  }

  transformWithSourceMap(
    fileKey: string,
    code: string,
    options: SourceMapOptions,
  ) {
    const s = new MagicString(code);
    let lastKey = 0;
    const generateCkey = () => this.toCkey(fileKey, lastKey++);
    s.replaceAll(TEXT_NODE_TAGFUNC, (_, text) => {
      const ckey = generateCkey();
      return `_.$$t("${ckey}", \`${text}\`)`;
    });
    s.replaceAll(COMPONENT_FUNC, (_, name) => {
      const ckey = generateCkey();
      return name === "t" ? `_.$$t("${ckey}",` : `_.$$("${name}", "${ckey}",`;
    });
    s.replaceAll(COMPONENT_FUNC_WITH_TYPE_PARAMS, (_, name, _targs) => {
      const ckey = generateCkey();
      return `_.$$("${name}", "${ckey}",`;
    });
    const map = s.generateMap(options);
    return {
      code: s.toString(),
      map,
    };
  }

  transform(fileKey: string, code: string) {
    let lastKey = 0;
    const generateCkey = () => this.toCkey(fileKey, lastKey++);
    code = code.replaceAll(TEXT_NODE_TAGFUNC, (_, text) => {
      const ckey = generateCkey();
      return `_.$$t("${ckey}", \`${text}\`)`;
    });
    code = code.replaceAll(COMPONENT_FUNC, (_, name) => {
      const ckey = generateCkey();
      return name === "t" ? `_.$$t("${ckey}",` : `_.$$("${name}", "${ckey}",`;
    });
    code = code.replaceAll(
      COMPONENT_FUNC_WITH_TYPE_PARAMS,
      (_, name, _targs) => {
        const ckey = generateCkey();
        return `_.$$("${name}", "${ckey}",`;
      },
    );
    return code;
  }

  transformFile(fileName: string, code: string) {
    let fileKey = this.fileKeys.get(fileName);
    if (fileKey === undefined) {
      fileKey = this.toFileKey(this.currentFileId++);
      this.fileKeys.set(fileName, fileKey);
    }
    return {
      ...this.transformWithSourceMap(fileKey, code, {
        source: fileName,
        file: fileName + ".map",
        includeContent: true,
      }),
      fileKey,
    };
  }
}
