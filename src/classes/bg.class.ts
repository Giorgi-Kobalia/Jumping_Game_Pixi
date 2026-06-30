import { Assets, Container, Sprite, TilingSprite } from "pixi.js";
import { BG_ADDITIONAL_CONSTANTS, BG_CONSTANTS, GAME_CONSTANTS } from "../constants";
import { createTillingSprite } from "../functions";

export class Bg {
  public container = new Container();
  public bodyContainer = new Container();
  public zombieSpeechContainer = new Container();
  public homelessSpeechContainer = new Container();
  public bgElements: TilingSprite[] = [];

  init() {
    BG_CONSTANTS.forEach((element) => {
      const spriteContainer = createTillingSprite(
        element.img,
        0,
        0,
        GAME_CONSTANTS.width,
        GAME_CONSTANTS.height
      );

      this.container.addChild(spriteContainer);
      this.bgElements.push(spriteContainer);
    });

    this.drawAdditionalElements();
  }

  drawAdditionalElements() {
    const { deadWoman, zombieSpeech, homelessSpeech } = BG_ADDITIONAL_CONSTANTS;

    const deadWomanSprite = new Sprite(Assets.get("dead_women"));
    deadWomanSprite.width = deadWoman.width;
    deadWomanSprite.height = deadWoman.height;
    this.bodyContainer.addChild(deadWomanSprite);
    this.bodyContainer.position.set(deadWoman.x, deadWoman.y);
    this.container.addChild(this.bodyContainer);

    const zombieSpeechSprite = new Sprite(Assets.get("zombieSpeech"));
    zombieSpeechSprite.width = zombieSpeech.width;
    zombieSpeechSprite.height = zombieSpeech.height;
    this.zombieSpeechContainer.addChild(zombieSpeechSprite);
    this.zombieSpeechContainer.position.set(zombieSpeech.x, zombieSpeech.y);
    this.zombieSpeechContainer.alpha = 0;
    this.container.addChild(this.zombieSpeechContainer);

    const homelessSpeechSprite = new Sprite(Assets.get("homelessSpeech"));
    homelessSpeechSprite.width = homelessSpeech.width;
    homelessSpeechSprite.height = homelessSpeech.height;
    this.homelessSpeechContainer.addChild(homelessSpeechSprite);
    this.homelessSpeechContainer.position.set(homelessSpeech.x, homelessSpeech.y);
    this.homelessSpeechContainer.alpha = 0;
    this.container.addChild(this.homelessSpeechContainer);
  }
}
