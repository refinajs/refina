import { $contextFunc, _ } from "../context";

/**
 * The state of an await call.
 */
type AwaitState =
  | {
      type: "pending";
    }
  | {
      type: "fulfilled";
      value: unknown;
    }
  | {
      type: "rejected";
      reason: unknown;
    };

export const _await = $contextFunc(
  (ckey, app) =>
    /**
     * Use data from an async call when rendering.
     *
     * **Note**: Use `try`/`catch` to handle errors.
     *
     * @example
     * ```ts
     * if (_.await(() => fetch("https://example.com"))) {
     *   // When the promise is fulfilled, _.await returns true.
     *
     *   _.p(_.$awaited.statusText);
     *
     *   // You can also use a custom id for a nesting await call.
     *   _.await(() => _.$awaited.text(), "Text") && _.p(_.$awaitedText);
     * } else {
     *   // When the promise is pending, _.await returns false.
     *
     *   _.p("Loading...");
     * }
     * ```
     *
     * @param executor The async function to execute. This function is called only for once.
     * @param id The id of the await call. If not provided, the id is an empty string. Access the awaited data with `_.$awaited<id>`.
     * @throws The error thrown by the async function.
     */
    <T, N extends string | number = "">(
      executor: () => Promise<T>,
      id: N = "" as N,
    ): // @ts-expect-error
    this is Record<`$awaited${N}`, T> => {
      const refTreeNode = _.$lowlevel.$$currentRefNode;

      if (!refTreeNode[ckey]) {
        // The await call is not started.
        refTreeNode[ckey] = {
          type: "pending",
        } as AwaitState;
        executor()
          .then(value => {
            refTreeNode[ckey] = {
              type: "fulfilled",
              value,
            } as AwaitState;
            app.update();
          })
          .catch(reason => {
            refTreeNode[ckey] = {
              type: "rejected",
              reason,
            } as AwaitState;
            app.update();
          });
      }

      const state = refTreeNode[ckey] as AwaitState;
      if (state.type === "pending") {
        return false;
      } else if (state.type === "fulfilled") {
        // @ts-expect-error
        _[`$awaited${id}`] = state.value;
        return true;
      } else {
        throw state.reason;
      }
    },
);
