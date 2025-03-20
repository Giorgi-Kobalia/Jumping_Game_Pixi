import { AnimatedSprite, Assets, Container } from "pixi.js";
import { ZOMBIE_CONSTANTS } from "../constants";

export class Zombie {
  public container = new Container();
  public sprite?: AnimatedSprite;

  init() {
    this.drawZombie();
  }

  drawZombie() {
    const texture = Assets.get("zombie_attack");
    this.sprite = AnimatedSprite.fromFrames(texture.data.animations["frames"]);
    this.sprite.width = ZOMBIE_CONSTANTS.zombie.width;
    this.sprite.height = ZOMBIE_CONSTANTS.zombie.height;

    this.sprite.animationSpeed = 0.2;
    this.sprite.loop = true;
    this.sprite.play();
    this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
    
    this.container.position.set(
      ZOMBIE_CONSTANTS.container.x,
      ZOMBIE_CONSTANTS.container.y
    );

    this.container.addChild(this.sprite);
  }
}
