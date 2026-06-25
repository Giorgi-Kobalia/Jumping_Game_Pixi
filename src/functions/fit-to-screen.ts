import { Container } from "pixi.js";

export type FitToScreenOptions = {
  container: Container;
  designWidth: number;
  designHeight: number;
  padding?: number;
  minScale?: number;
  maxScale?: number;
};

export function fitToScreen({
  container,
  designWidth,
  designHeight,
  padding = 1,
  minScale = 0.2,
  maxScale = 3,
}: FitToScreenOptions) {
  const rawScale =
    Math.min(
      window.innerWidth / designWidth,
      window.innerHeight / designHeight
    ) * padding;

  const scale = Math.min(Math.max(rawScale, minScale), maxScale);

  container.pivot.set(designWidth / 2, designHeight / 2);
  container.scale.set(scale);
  container.position.set(window.innerWidth / 2, window.innerHeight / 2);
}
