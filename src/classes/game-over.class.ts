import { Container, Graphics, Text, TextStyleOptions } from "pixi.js";
import { GAME_OVER_CONSTANTS } from "../constants";

export class GameOver {
  public container = new Container();
  private _onClose = () => undefined;
  public restart = new Text();

  set onClose(fun: () => undefined) {
    this._onClose = fun;
  }

  drawGameOverPopUp(value: number) {
    const bg = new Graphics();
    const adjustment = 70;
    bg.rect(0, 0, 400, 300).fill("transparent");

    this.restart = new Text({
      text: `${GAME_OVER_CONSTANTS.restart_text}`,
      style: GAME_OVER_CONSTANTS.restart_text_style,
    });

    const gameOverText = new Text({
      text: `${GAME_OVER_CONSTANTS.game_over_text} ${value}`,
      style:
        GAME_OVER_CONSTANTS.game_over_text_style as Partial<TextStyleOptions>,
    });

    gameOverText.anchor.set(0.5);

    gameOverText.position.set(bg.width / 2, bg.height / 2 - adjustment);

    this.restart.anchor.set(0.5);

    this.restart.position.set(bg.width / 2, bg.height / 2 + adjustment);

    this.restart.eventMode = "dynamic";
    this.restart.cursor = "pointer";
    this.restart.resolution = 2;
    gameOverText.resolution = 2;

    this.container.addChild(bg, gameOverText, this.restart);

    this.container.position.set(
      GAME_OVER_CONSTANTS.container.x,
      GAME_OVER_CONSTANTS.container.y
    );

    this.container.pivot.set(
      this.container.width / 2,
      this.container.height / 2
    );

    this.container.scale.set(0)

    this.restart.addEventListener("click", this.handleClose);
  }

  handleClose = () => {
    this.restart.removeAllListeners();
    this._onClose();
  };
}
