import { AnimatedSprite, Assets, Container } from "pixi.js";
import { CAT_CONSTANTS } from "../constants";

export class Cat {
  public container = new Container();
  public sprite?: AnimatedSprite;

  init() {
    this.drawCat();
  }

  drawCat() {
    const texture = Assets.get("idle");
    this.sprite = AnimatedSprite.fromFrames(texture.data.animations["idle"]);
    this.sprite.width = CAT_CONSTANTS.cat.width;
    this.sprite.height = CAT_CONSTANTS.cat.height;

    this.sprite.animationSpeed = 0.1;
    this.sprite.play();

    this.container.position.set(
      CAT_CONSTANTS.container.x,
      CAT_CONSTANTS.container.y
    );

    this.container.addChild(this.sprite);
  }
}
