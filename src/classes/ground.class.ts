import { Container, Graphics } from "pixi.js";
import { createSprite } from "../functions/create-sprite.function";

const groundObjects = [
  {
    img: "bush1",
    x: 0,
    y: 20,
    width: 150,
    height: 90,
  },
  {
    img: "bush2",
    x: 290,
    y: 110,
    width: 150,
    height: 70,
  },
  {
    img: "bush1",
    x: 580,
    y: 20,
    width: 150,
    height: 90,
  },
  {
    img: "bush2",
    x: 870,
    y: 110,
    width: 150,
    height: 70,
  },
  {
    img: "bush1",
    x: 1160,
    y: 20,
    width: 150,
    height: 90,
  },
  {
    img: "bush2",
    x: 1450,
    y: 110,
    width: 150,
    height: 70,
  },
];

export class Ground {
  public container = new Container();
  public groundElements: Container[] = [];

  init() {
    const groundLine = new Graphics();
    groundLine.rect(0, 0, 1600, 5).fill("black");
    this.container.addChild(groundLine);

    groundObjects.forEach((element) => {
      const spriteContainer = createSprite(
        element.img,
        element.x,
        element.y,
        element.width,
        element.height
      );

      this.container.addChild(spriteContainer);
      this.groundElements.push(spriteContainer);
      this.container.position.set(0, 598);
    });
  }
}
