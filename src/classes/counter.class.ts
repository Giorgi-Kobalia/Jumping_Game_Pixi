import { Container, Text } from "pixi.js";
import { COUNTER_CONSTANTS } from "../constants";

export class Counter {
  public container = new Container();
  public jumpCounterText?: Text;

  init() {
    this.drawCounter();
  }

  drawCounter() {
    this.jumpCounterText = new Text({
      text: `SCORE : 0`,
      style: COUNTER_CONSTANTS.text_style,
    });

    this.container.position.set(
      COUNTER_CONSTANTS.container.x,
      COUNTER_CONSTANTS.container.y
    );

    this.jumpCounterText.resolution = 2;

    this.container.addChild(this.jumpCounterText);
  }

  updateCounter(value: number) {
    if (this.jumpCounterText) this.jumpCounterText.text = `SCORE : ${value}`;
  }
}
