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
  private sprites: Partial<Record<T, AnimatedSprite>> = {};

  constructor(private config: CharacterConfig<T>) {}

  init() {
    this.draw();
  }

  draw() {
    for (const type of Object.keys(this.config.animations) as T[]) {
      const texture = Assets.get(type);
      const sprite = AnimatedSprite.fromFrames(texture.data.animations["frames"]);

      sprite.setSize(this.config.defaultSize.width, this.config.defaultSize.height);

      const { animationSpeed, loop } = this.config.animations[type];
      sprite.animationSpeed = animationSpeed;
      sprite.loop = loop;

      if (this.config.mirrored) {
        sprite.scale.x = -Math.abs(sprite.scale.x);
      }

      sprite.visible = false;
      this.container.addChild(sprite);
      this.sprites[type] = sprite;
    }

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
    const next = this.sprites[type];
    if (!next) return;

    if (this.sprite === next) {
      this.sprite.gotoAndPlay(this.config.animations[type].gotoAndPlay);
      return;
    }

    if (this.sprite) this.sprite.visible = false;

    this.sprite = next;
    this.sprite.visible = true;
    this.sprite.gotoAndPlay(this.config.animations[type].gotoAndPlay);
  }

  setSize(size: SizeType) {
    if (!this.sprite) return;
    this.sprite.setSize(size.width, size.height);
  }

  setPosition(position: PositionType) {
    this.container.position.set(position.x, position.y);
  }
}
