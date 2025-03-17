import { Assets, Container, Sprite } from "pixi.js";
import { CAT_CONSTANTS } from "../constants";

export class Cat {
  public container = new Container();
  public sprite?: Sprite;

  init() {
    this.drawCat();
  }

  drawCat() {
    this.sprite = new Sprite(Assets.get("cat"));
    this.sprite.width = CAT_CONSTANTS.cat.width;
    this.sprite.height = CAT_CONSTANTS.cat.height;

    this.container.position.set(
      CAT_CONSTANTS.container.x,
      CAT_CONSTANTS.container.y
    );

    this.container.addChild(this.sprite);
  }
}
