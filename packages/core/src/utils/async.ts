import { Prelude } from "../constants";

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
      type: "error";
      reason: unknown;
    };

Prelude.registerFunc(
  "await",
  function (
    ckey: string,
    executor: () => Promise<unknown>,
    id: string | number = "",
  ): boolean {
    const refTreeNode = this.$$currentRefTreeNode;

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
          this.$update();
        })
        .catch(reason => {
          refTreeNode[ckey] = {
            type: "error",
            reason,
          } as AwaitState;
          this.$update();
        });
    }

    const state = refTreeNode[ckey] as AwaitState;
    if (state.type === "pending") {
      return false;
    } else if (state.type === "fulfilled") {
      // @ts-ignore
      this[`$awaited${id}`] = state.value;
      return true;
    } else {
      throw state.reason;
    }
  },
);

declare module "../context/base" {
  interface ContextFuncs<C> {
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
    await: (<T, N extends string | number>(
      executor: () => Promise<T>,
      id: N,
    ) => // @ts-ignore
    this is Record<`$awaited${N}`, T>) &
      (<T>(executor: () => Promise<T>) => // @ts-ignore
      this is {
        $awaited: T;
      });
  }
}
