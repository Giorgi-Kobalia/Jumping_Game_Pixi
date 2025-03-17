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
    this.restart = new Text({
      text: `${GAME_OVER_CONSTANTS.restart_text}`,
      style: GAME_OVER_CONSTANTS.restart_text_style,
    });

    const bg = new Graphics().rect(0, 0, 500, 250).fill(0xff0000);

    const gameOverText = new Text({
      text: `${GAME_OVER_CONSTANTS.game_over_text} ${value}`,
      style:
        GAME_OVER_CONSTANTS.game_over_text_style as Partial<TextStyleOptions>,
    });

    gameOverText.anchor.set(0.5);
    this.restart.anchor.set(0.5);

    gameOverText.position.set(
      GAME_OVER_CONSTANTS.game_over_text_position.x,
      GAME_OVER_CONSTANTS.game_over_text_position.y
    );

    this.restart.position.set(
      GAME_OVER_CONSTANTS.restar_text_position.x,
      GAME_OVER_CONSTANTS.restar_text_position.y
    );

    this.restart.eventMode = "dynamic";
    this.restart.cursor = "pointer";

    this.container.addChild(bg, gameOverText, this.restart);
    this.container.pivot.set(
      this.container.width / 2,
      this.container.height / 2
    );

    this.container.position.set(
      GAME_OVER_CONSTANTS.container.x,
      GAME_OVER_CONSTANTS.container.y
    );

    this.restart.addEventListener("click", this.handleClose);
  }

  handleClose = () => {
    this.restart.removeAllListeners();
    this._onClose();
  };
}
