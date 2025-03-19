import { Container } from "pixi.js";
import { createTillingSprite } from "../functions/create-tilling-sprites";
import { bgObjects } from "../constants";

export class Bg {
  public container = new Container();
  public bgElements: Container[] = [];

  init() {
    bgObjects.forEach((element) => {
      const spriteContainer = createTillingSprite(
        element.img,
        0,
        80,
        1600,
        566
      );

      this.container.addChild(spriteContainer);
      this.bgElements.push(spriteContainer);
    });
  }
}
