import { Assets, Container, Sprite } from "pixi.js";

export const createSprite = function (
  img: string,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const container = new Container();

  const sprite = new Sprite(Assets.get(`${img}`));

  sprite.width = width;
  sprite.height = height;
  
  container.addChild(sprite);
  container.position.set(x, y);

  return container;
}

