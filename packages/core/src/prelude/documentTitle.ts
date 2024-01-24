import { $contextFunc, _ } from "../context";

export const documentTitle = $contextFunc(_ckey =>
  /**
   * Set the document title.
   *
   * **Warning**: The document title will be overwritten by the last call to this function.
   */
  (title: string) => {
    if (_.$updateContext) {
      document.title = title;
    }
    return true as const;
  },
);
