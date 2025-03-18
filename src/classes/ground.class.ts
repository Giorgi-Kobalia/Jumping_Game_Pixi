import { Container, Graphics } from "pixi.js";
import { createSprite } from "../functions/create-sprite.function";
import { groundObjects } from "../constants";

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
