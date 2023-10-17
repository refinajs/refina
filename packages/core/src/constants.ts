import { Plugin } from "./app/plugin";

export enum AppState {
  update,
  recv,
}

export const Prelude = new Plugin("prelude");
