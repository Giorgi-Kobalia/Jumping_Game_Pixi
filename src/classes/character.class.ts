import { AnimatedSprite, Assets, Container, Graphics } from "pixi.js";
import { PositionType, SizeType } from "../types";

export type AnimationPropsType = {
  animationSpeed: number;
  loop: boolean;
  gotoAndPlay: number;
};

export type HitBoxConfigType = {
  width: number;
  height: number;
  offsetX: number;
  offsetY?: number;
};

export type CharacterConfig<T extends string> = {
  defaultPosition: PositionType;
  defaultSize: SizeType;
  hitBox: HitBoxConfigType;
  animations: Record<T, AnimationPropsType>;
  initialAnimation: T;
  mirrored?: boolean;
};

export class Character<T extends string> {
  public container = new Container();
  public hitBoxContainer = new Container();
  public sprite?: AnimatedSprite;

  constructor(private config: CharacterConfig<T>) {}

  init() {
    this.draw();
  }

  draw() {
    this.setAnimation(this.config.initialAnimation);
    this.setPosition(this.config.defaultPosition);
    this.setHitBox();
  }

  setHitBox() {
    if (!this.sprite) return;

    const { width, height, offsetX, offsetY = 0 } = this.config.hitBox;
    const hitbox = new Graphics();
    hitbox.rect(0, 0, width, height).fill("transparent");

    this.hitBoxContainer.position.set(offsetX, offsetY);

    this.hitBoxContainer.addChild(hitbox);
    this.container.addChild(this.hitBoxContainer);
  }

  setAnimation(type: T) {
    this.sprite?.destroy();

    const texture = Assets.get(type);
    this.sprite = AnimatedSprite.fromFrames(texture.data.animations["frames"]);

    this.setSize(this.config.defaultSize);
    this.setAnimationProps(type);

    this.container.addChild(this.sprite);
  }

  setSize(size: SizeType) {
    if (!this.sprite) return;
    this.sprite.setSize(size.width, size.height);
  }

  setAnimationProps(type: T) {
    if (!this.sprite) return;
    const { animationSpeed, loop, gotoAndPlay } = this.config.animations[type];
    this.sprite.animationSpeed = animationSpeed;
    this.sprite.loop = loop;
    this.sprite.gotoAndPlay(gotoAndPlay);

    if (this.config.mirrored) {
      this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
    }
  }

  setPosition(position: PositionType) {
    this.container.position.set(position.x, position.y);
  }
}
