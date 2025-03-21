import { Assets, Container, Sprite } from "pixi.js";
import { BG_CONSTANTS } from "../constants";
import { createTillingSprite } from "../functions";

export class Bg {
  public container = new Container();
  public bodyContainer = new Container();
  public zombieSpeachContainer = new Container();
  public homelessSpeachContainer = new Container();
  public bgElements: Container[] = [];

  init() {
    BG_CONSTANTS.forEach((element) => {
      const spriteContainer = createTillingSprite(
        element.img,
        0,
        0,
        1600,
        566
      );

      this.container.addChild(spriteContainer);
      this.bgElements.push(spriteContainer);
    });

    this.drawEdditionalElements();
  }

  drawEdditionalElements() {
    const deadWoman = new Sprite(Assets.get("dead_women"));
    deadWoman.width = 124;
    deadWoman.height = 22;
    this.bodyContainer.addChild(deadWoman);
    this.bodyContainer.position.set(1350, 516);
    this.container.addChild(this.bodyContainer);

    const zombieSpeach = new Sprite(Assets.get("zombieSpeach"));
    zombieSpeach.width = 200;
    zombieSpeach.height = 70;
    this.zombieSpeachContainer.addChild(zombieSpeach);
    this.zombieSpeachContainer.position.set(1320, 400);
    this.zombieSpeachContainer.alpha = 0
    this.container.addChild(this.zombieSpeachContainer);

    const homelessSpeach = new Sprite(Assets.get("homelessSpeach"));
    homelessSpeach.width = 200;
    homelessSpeach.height = 70;
    this.homelessSpeachContainer.addChild(homelessSpeach);
    this.homelessSpeachContainer.position.set(330, 350);
    this.homelessSpeachContainer.alpha = 0
    this.container.addChild(this.homelessSpeachContainer);
  }
}
