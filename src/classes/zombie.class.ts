import { AnimatedSprite, Assets, Container } from "pixi.js";
import { ZOMBIE_ANIMATION, ZOMBIE_CONSTANTS } from "../constants";
import { ZombieType, PositionType, SizeType } from "../types";

export class Zombie {
  public container = new Container();
  public sprite?: AnimatedSprite;
  private defaultPosition = ZOMBIE_CONSTANTS.container;
  private defaultSize = ZOMBIE_CONSTANTS.zombie;

  init() {
    this.drawZombie();
  }

  drawZombie() {
    this.setAnimation(ZombieType.WALK);
  }

  setAnimation(type: ZombieType) {
    this.sprite?.destroy();

    const texture = Assets.get(type);
    this.sprite = AnimatedSprite.fromFrames(texture.data.animations["frames"]);

    this.setSize(this.defaultSize);
    this.setAnimationProps(type);
    this.setPosition(this.defaultPosition);

    this.container.addChild(this.sprite);
  }

  setSize(size: SizeType) {
    if (!this.sprite) return;
    this.sprite.setSize(size.width, size.height);
  }

  setAnimationProps(type: ZombieType) {
    if (!this.sprite) return;
    const { animationSpeed, loop, gotoAndPlay } = ZOMBIE_ANIMATION[type];
    this.sprite.animationSpeed = animationSpeed;
    this.sprite.loop = loop;
    this.sprite.gotoAndPlay(gotoAndPlay);
    this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
  }

  setPosition(position: PositionType) {
    if (!this.sprite) return;
    this.sprite.position.set(position.x, position.y);
  }
}
