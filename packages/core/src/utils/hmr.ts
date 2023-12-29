export interface RefinaHMRCtx {
  /**
   * The Ckeys removed in the last HMR update.
   */
  removedCkeys: string[];
}

declare global {
  interface Window {
    /**
     * The HMR context.
     */
    __REFINA_HMR__?: RefinaHMRCtx;
  }
}
