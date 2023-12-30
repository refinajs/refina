import MagicString, { SourceMapOptions } from "magic-string";
import patterns from "./patterns";

export class RefinaTransformer {
  currentFileId = 0;
  fileKeys = new Map<string, string>();

  toFileKey(id: number) {
    return id.toString(36).toUpperCase();
  }
  toCkey(fileKey: string, callId: number) {
    return `${fileKey}-${callId.toString(36).toUpperCase()}`;
  }

  transformWithSourceMap(
    fileKey: string,
    code: string,
    options: SourceMapOptions,
  ) {
    const s = new MagicString(code);
    let lastKey = 0;
    const generateCkey = () => this.toCkey(fileKey, lastKey++);
    s.replaceAll(patterns.TEXT_NODE_TAGFUNC, (_, text) => {
      const ckey = generateCkey();
      return `_.$$t("${ckey}", \`${text}\`)`;
    });
    s.replaceAll(patterns.COMPONENT_FUNC, (_, name) => {
      const ckey = generateCkey();
      return name === "t" ? `_.$$t("${ckey}",` : `_.$$("${name}", "${ckey}",`;
    });
    s.replaceAll(
      patterns.COMPONENT_FUNC_WITH_TYPE_PARAMS,
      (_, name, _targs) => {
        const ckey = generateCkey();
        return `_.$$("${name}", "${ckey}",`;
      },
    );
    const map = s.generateMap(options);
    return lastKey === 0
      ? null
      : {
          code: s.toString(),
          map,
        };
  }

  transform(fileKey: string, code: string) {
    let lastKey = 0;
    const generateCkey = () => this.toCkey(fileKey, lastKey++);
    code = code.replaceAll(patterns.TEXT_NODE_TAGFUNC, (_, text) => {
      const ckey = generateCkey();
      return `_.$$t("${ckey}", \`${text}\`)`;
    });
    code = code.replaceAll(patterns.COMPONENT_FUNC, (_, name) => {
      const ckey = generateCkey();
      return name === "t" ? `_.$$t("${ckey}",` : `_.$$("${name}", "${ckey}",`;
    });
    code = code.replaceAll(
      patterns.COMPONENT_FUNC_WITH_TYPE_PARAMS,
      (_, name, _targs) => {
        const ckey = generateCkey();
        return `_.$$("${name}", "${ckey}",`;
      },
    );
    return lastKey === 0 ? null : code;
  }

  transformFile(fileName: string, code: string) {
    let fileKey = this.fileKeys.get(fileName);
    if (fileKey === undefined) {
      fileKey = this.toFileKey(this.currentFileId++);
      this.fileKeys.set(fileName, fileKey);
    }
    const result = this.transformWithSourceMap(fileKey, code, {
      source: fileName,
      includeContent: true,
    });
    if (result === null) {
      this.currentFileId--;
      return null;
    }
    return {
      ...result,
      fileKey,
    };
  }
}

export { patterns };
