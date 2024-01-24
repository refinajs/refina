/**
 * The state of the app.
 */
export enum AppState {
  /**
   * The app is not running.
   */
  IDLE = "idle",

  /**
   * The app is running to update DOM.
   */
  UPDATE = "update",

  /**
   * The app is running to receive events.
   */
  RECV = "recv",
}

// Add the `DEV` property to `import.meta.env`.
// This property is used to check if the app is running in development mode.
// See https://vitejs.dev/guide/env-and-mode.html#env-variables
declare global {
  interface ImportMetaEnv {
    /**
     * Whether the app is running in development mode.
     *
     * In development mode, Refina will print detailed runtime information to the console,
     *  and extra checks will be performed to ensure the app is running correctly.
     */
    DEV: boolean;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
