import { RefinaTransformer, patterns } from "@refina/transformer";
import { CommonOptions, getFilter } from "./options";
import { Plugin } from "vite";
import Dts from "vite-plugin-dts";

export interface RefinaLibOptions extends CommonOptions {
  /**
   * The transformer to use.
   *
   * @default new RefinaTransformer()
   */
  transformer?: RefinaTransformer;
}

export function RefinaLib(options: RefinaLibOptions = {}): Plugin[] {
  const filter = getFilter(options);

  const transformer = options.transformer ?? new RefinaTransformer();

  transformer.toCkey = () => patterns.CKEY_PLACEHOLDER;

  return [
    {
      name: "refina:lib",
      enforce: "pre",
      config() {
        return {
          build: {
            lib: {
              entry: "./src/index.ts",
              formats: ["es"],
              fileName: "index",
            },
            sourcemap: true,
            rollupOptions: {
              external(source, importer, isResolved) {
                return (
                  importer !== undefined &&
                  !isResolved &&
                  !source.startsWith(".") &&
                  !source.startsWith("/")
                );
              },
            },
          },
        };
      },
      transform(raw, id) {
        if (!filter(id, raw)) return null;
        return transformer.transformFile(id, raw, true);
      },
    },
    Dts(),
  ];
}
