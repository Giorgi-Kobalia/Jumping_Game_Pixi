import { Assets, Container, Sprite } from "pixi.js";
import { BG_CONSTANTS, GAME_CONSTANTS } from "../constants";
import { createTillingSprite } from "../functions";

export class Bg {
  public container = new Container();
  public bodyContainer = new Container();
  public zombieSpeechContainer = new Container();
  public homelessSpeechContainer = new Container();
  public bgElements: Container[] = [];

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
    const deadWoman = new Sprite(Assets.get("dead_women"));
    deadWoman.width = 124;
    deadWoman.height = 22;
    this.bodyContainer.addChild(deadWoman);
    this.bodyContainer.position.set(1350, 516);
    this.container.addChild(this.bodyContainer);

    const zombieSpeech = new Sprite(Assets.get("zombieSpeech"));
    zombieSpeech.width = 200;
    zombieSpeech.height = 70;
    this.zombieSpeechContainer.addChild(zombieSpeech);
    this.zombieSpeechContainer.position.set(1320, 400);
    this.zombieSpeechContainer.alpha = 0;
    this.container.addChild(this.zombieSpeechContainer);

    const homelessSpeech = new Sprite(Assets.get("homelessSpeech"));
    homelessSpeech.width = 200;
    homelessSpeech.height = 70;
    this.homelessSpeechContainer.addChild(homelessSpeech);
    this.homelessSpeechContainer.position.set(330, 350);
    this.homelessSpeechContainer.alpha = 0;
    this.container.addChild(this.homelessSpeechContainer);
  }
}
