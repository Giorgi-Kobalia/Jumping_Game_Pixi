import { AnimatedSprite, Assets, Container } from "pixi.js";
import { HOMELESS_CONSTANTS } from "../constants";

export class Homeless {
  public container = new Container();
  public sprite?: AnimatedSprite;

  init() {
    this.drawHomeless();
  }

  drawHomeless() {
    const texture = Assets.get("homeless_dead");
    this.sprite = AnimatedSprite.fromFrames(texture.data.animations["frames"]);
    this.sprite.width = HOMELESS_CONSTANTS.homeless.width;
    this.sprite.height = HOMELESS_CONSTANTS.homeless.height;

    this.sprite.animationSpeed = 0.2;
    this.sprite.loop = true;
    this.sprite.play();

    this.container.position.set(
      HOMELESS_CONSTANTS.container.x,
      HOMELESS_CONSTANTS.container.y
    );

    this.container.addChild(this.sprite);
  }
}
