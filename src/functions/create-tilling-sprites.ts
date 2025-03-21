import { Assets, TilingSprite } from "pixi.js";

export const createTillingSprite = function (
  img: string,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const texture = Assets.get(`${img}`);
  const sprite = new TilingSprite({
    texture,
    width,
    height,
  });

  const scale = height / texture.height;
  sprite.tileScale.set(scale);

  sprite.position.set(x, y);

  return sprite;
};
