import { Container } from "pixi.js";
import { createSprite } from "../functions/create-sprite.function";
import { skyObjects } from "../constants";

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
