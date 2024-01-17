import { onBeforeUnmount } from "vue";

export type ExampleData = {
  [key: string]: string | Record<string, string>;
} & {
  "import-map.json"?: string;
  _hint?: ExampleData;
};

function forEachComponent(
  raw: ExampleData,
  files: Record<string, string>,
  cb: (filename: string, file: Record<string, string>) => void,
) {
  for (const filename in raw) {
    const content = raw[filename];
    if (
      filename === "description.txt" ||
      filename === "description.md" ||
      filename === "_hint"
    ) {
      continue;
    } else if (typeof content === "string") {
      files[filename] = content;
    } else {
      cb(filename, content);
    }
  }
}

export function resolveSFCExample(raw: ExampleData) {
  const files: Record<string, string> = {};
  forEachComponent(raw, files, (filename, content) => {
    Object.assign(files, content);
  });
  return files;
}

export function onHashChange(cb: () => void) {
  window.addEventListener("hashchange", cb);
  onBeforeUnmount(() => {
    window.removeEventListener("hashchange", cb);
  });
}
