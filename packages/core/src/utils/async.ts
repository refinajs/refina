import { Prelude } from "../constants";

/**
 * The key of await states in `permanentData`
 */
const awaitStatesSymbol = Symbol("await states");

/**
 * The state of an await call.
 */
type AwaitState =
  | {
      type: "pending";
    }
  | {
      type: "fulfilled";
      value: any;
    }
  | {
      type: "error";
      reason: any;
    };

Prelude.registerFunc(
  "await",
  function (
    ckey: string,
    executor: () => Promise<any>,
    id: string | number = "",
  ): boolean {
    const ikey = this.$app.pushKey(ckey);

    // Initialize the record of await states.
    this.$permanentData[awaitStatesSymbol] ??= {};

    // Get the record of await state
    // The key of the record is the Ikey of the await call.
    const awaitStates = this.$permanentData[awaitStatesSymbol] as Record<
      string,
      AwaitState
    >;

    if (!awaitStates[ikey]) {
      // The await call is not started.
      awaitStates[ikey] = {
        type: "pending",
      };
      executor()
        .then(value => {
          awaitStates[ikey] = {
            type: "fulfilled",
            value,
          };
          this.$update();
        })
        .catch(reason => {
          awaitStates[ikey] = {
            type: "error",
            reason,
          };
          this.$update();
        });
    }

    this.$app.popKey(ikey);

    const state = awaitStates[ikey];
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

declare module "../context" {
  interface ContextFuncs<C> {
    /**
     * Use data from an async call when rendering.
     *
     * **Warning**: **DO NOT** change the Ikey of the await call,
     *  or the data will be lost, and a new async call will be made.
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
     * @param executor The async function to execute. This function is called only once for each different Ikey.
     * @param id The id of the await call. If not provided, the id is an empty string. Access the awaited data with `_.$awaited<id>`.
     * @throws The error thrown by the async function.
     */
    await: (<T, N extends string | number>(
      executor: () => Promise<T>,
      id: N,
    ) => // @ts-ignore
    this is Record<`$awaited${K}`, T>) &
      (<T>(executor: () => Promise<T>) => // @ts-ignore
      this is {
        $awaited: T;
      });
  }
}
