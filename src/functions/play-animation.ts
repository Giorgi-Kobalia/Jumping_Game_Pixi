import { AnimatedSprite } from "pixi.js";

export function playAnimationAndWait(sprite: AnimatedSprite): Promise<void> {
  return new Promise((resolve) => {
    sprite.onComplete = () => resolve();
  });
}
