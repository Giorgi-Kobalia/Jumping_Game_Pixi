import { Container, Text, TextStyleOptions } from "pixi.js";
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

    const gameOverText = new Text({
      text: `${GAME_OVER_CONSTANTS.game_over_text} ${value}`,
      style:
        GAME_OVER_CONSTANTS.game_over_text_style as Partial<TextStyleOptions>,
    });

    this.restart.position.set(
      GAME_OVER_CONSTANTS.restar_text_position.x,
      GAME_OVER_CONSTANTS.restar_text_position.y
    );

    this.restart.eventMode = "dynamic";
    this.restart.cursor = "pointer";
    this.restart.resolution = 2;
    gameOverText.resolution = 2;

    this.container.addChild(gameOverText, this.restart);

    this.container.position.set(
      GAME_OVER_CONSTANTS.container.x,
      GAME_OVER_CONSTANTS.container.y
    );

    this.container.pivot.set(
      this.container.width / 2,
      this.container.height / 2
    );

    this.restart.addEventListener("click", this.handleClose);
  }

  handleClose = () => {
    this.restart.removeAllListeners();
    this._onClose();
  };
}
