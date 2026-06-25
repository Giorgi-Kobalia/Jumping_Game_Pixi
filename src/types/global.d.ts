import type { Application } from "pixi.js";

declare global {
  var __PIXI_APP__: Application | undefined;

  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  }
}

export {};
