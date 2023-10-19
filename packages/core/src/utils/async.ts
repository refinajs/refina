import { Prelude } from "../constants";
import { D } from "../data";

const asyncRecordsSymbol = Symbol("async record");

type AsyncRecord =
  | {
      state: true;
      awaitedValue: any;
    }
  | {
      state: false;
      awaitedValue: undefined;
    }
  | {
      state: "error";
      awaitedValue: any;
    };

Prelude.register(
  "async",
  function (
    ckey: string,
    executor: () => Promise<any>,
    id: string | number = "",
  ): boolean {
    const ikey = this.$app.pushKey(ckey);

    this.$permanentData[asyncRecordsSymbol] ??= {};

    const asyncRecords = this.$permanentData[asyncRecordsSymbol] as Record<
      string,
      AsyncRecord
    >;
    let record = asyncRecords[ikey];

    if (!record) {
      record = asyncRecords[ikey] = {
        state: false,
        awaitedValue: undefined,
      } as AsyncRecord;
      executor()
        .then((value) => {
          record.state = true;
          record.awaitedValue = value;
          this.$update();
        })
        .catch((reason) => {
          record.state = "error";
          record.awaitedValue = reason;
          this.$update();
        });
    }
    this.$app.popKey(ckey);

    const { state, awaitedValue } = record;
    if (state) {
      if (state === "error") {
        throw awaitedValue;
      }
      //@ts-ignore
      this[`$awaited${id}`] = awaitedValue;
      return true;
    } else {
      return false;
    }
  },
);

const awaitRecordsSymbol = Symbol("await record");

Prelude.register(
  "awaits",
  function (
    ckey: string,
    id: string | number,
    executor: () => Promise<any>,
    overlay: D<boolean> = false,
  ) {
    this.$permanentData[awaitRecordsSymbol] ??= {};
    const awaitRecords = this.$permanentData[awaitRecordsSymbol] as Record<
      string,
      AsyncRecord
    >;
    if (!overlay && awaitRecords[id]) {
      return;
    }
    awaitRecords[id] = {
      state: false,
      awaitedValue: undefined,
    };
    const record = awaitRecords[id];
    executor()
      .then((value) => {
        record.state = true;
        record.awaitedValue = value;
        this.$update();
      })
      .catch((reason) => {
        record.state = "error";
        record.awaitedValue = reason;
        this.$update();
      });
  },
);

Prelude.register("awaited", function (ckey: string, id: string | number) {
  const record = this.$permanentData[awaitRecordsSymbol]?.[id] as AsyncRecord;
  if (record?.state) {
    const { state, awaitedValue } = record;
    if (state === "error") {
      throw awaitedValue;
    }
    //@ts-ignore
    this[`$awaited${id}`] = awaitedValue;
    return true;
  } else {
    return false;
  }
});

declare module "../context" {
  interface CustomContext<C> {
    async: (<T, N extends string | number>(
      executor: () => Promise<T>,
      id: N,
    ) => //@ts-ignore
    this is {
      [K in N as `$awaited${K}`]: T;
    }) &
      (<T>(executor: () => Promise<T>) => //@ts-ignore
      this is {
        $awaited: T;
      });
    awaits: <T, N extends string | number>(
      id: N,
      executor: () => Promise<T>,
      overlay?: D<boolean>,
    ) => void;
    awaited: <T, N extends string | number>(
      id: N,
    ) => //@ts-ignore
    this is {
      [K in N as `$awaited${K}`]: T;
    };
  }
}
