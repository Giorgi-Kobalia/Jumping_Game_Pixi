import { Container, Graphics, Text } from "pixi.js";
import { COUNTER_CONSTANTS } from "../constants";

export class Counter {
  public container = new Container();
  public jumpCounterText?: Text;
  public darkBg = new Graphics();
  public border = new Graphics(); // New border graphic

  init() {
    this.drawCounter();
  }

  drawCounter() {
    this.jumpCounterText = new Text({
      text: ``,
      style: COUNTER_CONSTANTS.text_style,
    });

    this.container.position.set(
      COUNTER_CONSTANTS.container.x,
      COUNTER_CONSTANTS.container.y
    );

    this.darkBg.rect(0, 0, 300, 50).fill("black");
    this.darkBg.alpha = 0.7;

    this.container.addChild(this.border, this.darkBg, this.jumpCounterText);

    this.border
      .rect(0, 0, this.container.width, this.container.height)
      .stroke({ color: 0x000000, width: 5 });

    this.jumpCounterText.resolution = 2;

    this.updateCounter(0);
  }

  updateCounter(value: number) {
    if (this.jumpCounterText) {
      this.jumpCounterText.text = `SCORE : ${value}`;

      this.jumpCounterText.pivot.set(
        this.jumpCounterText.width / 2,
        this.jumpCounterText.height / 2
      );

      this.jumpCounterText.position.set(
        this.darkBg.width / 2,
        this.darkBg.height / 2
      );
    }
  }
}
