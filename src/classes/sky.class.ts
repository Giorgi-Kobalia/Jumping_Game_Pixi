import { Container } from "pixi.js";
import { createSprite } from "../functions/create-sprite.function";

const skyObjects = [
  {
    img: "sky2",
    x: 0,
    y: 40,
    width: 150,
    height: 150,
  },
  {
    img: "sky1",
    x: 290,
    y: 10,
    width: 150,
    height: 100,
  },
  {
    img: "sky2",
    x: 580,
    y: 40,
    width: 150,
    height: 150,
  },
  {
    img: "sky1",
    x: 870,
    y: 10,
    width: 150,
    height: 100,
  },
  {
    img: "sky2",
    x: 1160,
    y: 40,
    width: 150,
    height: 150,
  },
  {
    img: "sky1",
    x: 1450,
    y: 10,
    width: 150,
    height: 100,
  },
];

export class Sky {
  public container = new Container();
  public skyElements: Container[] = [];

  init() {
    skyObjects.forEach((element) => {
      const spriteContainer = createSprite(
        element.img,
        element.x,
        element.y,
        element.width,
        element.height
      );

      this.container.addChild(spriteContainer);
      this.skyElements.push(spriteContainer);
    });
  }
}
