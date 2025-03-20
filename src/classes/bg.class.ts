import { Container } from "pixi.js";
import { BG_CONSTANTS } from "../constants";
import { createTillingSprite } from "../functions";

export class Bg {
  public container = new Container();
  public bgElements: Container[] = [];

  init() {
    BG_CONSTANTS.forEach((element) => {
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
