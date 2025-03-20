import { AnimatedSprite, Assets, Container, Graphics } from "pixi.js";
import { HOMELESS_ANIMATION, HOMELESS_CONSTANTS } from "../constants";
import { HomelessType, PositionType, SizeType } from "../types";

export class Homeless {
  public container = new Container();
  public hitBoxContainer = new Container();
  public sprite?: AnimatedSprite;
  private defaultPosition = HOMELESS_CONSTANTS.container;
  private defaultSize = HOMELESS_CONSTANTS.homeless;

  init() {
    this.drawHomeless();
  }

  drawHomeless() {
    this.setAnimation(HomelessType.WALK);
    this.setPosition(this.defaultPosition);
    this.setHitBox();
  }

  setHitBox() {
    if (!this.sprite) return;

    const hitboxWidth = 30;
    const hitboxHeight = 120;
    const hitbox = new Graphics();
    hitbox.rect(0, 0, hitboxWidth, hitboxHeight).fill("transparent");

    this.hitBoxContainer.position.set(-28, 0);

    this.hitBoxContainer.addChild(hitbox);
    this.container.addChild(this.hitBoxContainer);
  }

  setAnimation(type: HomelessType) {
    this.sprite?.destroy();

    const texture = Assets.get(type);
    this.sprite = AnimatedSprite.fromFrames(texture.data.animations["frames"]);

    this.setSize(this.defaultSize);
    this.setAnimationProps(type);

    this.container.addChild(this.sprite);
  }

  setSize(size: SizeType) {
    if (!this.sprite) return;
    this.sprite.setSize(size.width, size.height);
  }

  setAnimationProps(type: HomelessType) {
    if (!this.sprite) return;
    const { animationSpeed, loop, gotoAndPlay } = HOMELESS_ANIMATION[type];
    this.sprite.animationSpeed = animationSpeed;
    this.sprite.loop = loop;
    this.sprite.gotoAndPlay(gotoAndPlay);
  }

  setPosition(position: PositionType) {
    this.container.position.set(position.x, position.y);
  }
}
