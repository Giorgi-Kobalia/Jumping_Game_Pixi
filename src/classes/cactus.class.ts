import { Assets, Container, Sprite } from "pixi.js";
import { CACTUS_CONSTANTS } from "../constants";

export class Cactus {
  public container = new Container();
  public sprite?: Sprite;

  init() {
    this.drawCactus();
  }

  drawCactus() {
    this.sprite = new Sprite(Assets.get("cactus"));
    this.sprite.width = CACTUS_CONSTANTS.cactus.width;
    this.sprite.height = CACTUS_CONSTANTS.cactus.height;

    this.container.position.set(
      CACTUS_CONSTANTS.container.x,
      CACTUS_CONSTANTS.container.y
    );

    this.container.addChild(this.sprite);
  }
}
