import { Container, Graphics, Text } from "pixi.js";
import { GAME_OVER_CONSTANTS } from "../constants";

export class GameOver {
  public container = new Container();

  drawGameOverPopUp(value: number) {
    const restart = new Text({
      text: `RESTART`,
      style: GAME_OVER_CONSTANTS.restart_text_style,
    });

    const bg = new Graphics().rect(0, 0, 500, 250).fill(0xff0000);

    const gameOverText = new Text({
      text: `GAME OVER YOUR SCORE: ${value}`,
      style: GAME_OVER_CONSTANTS.game_over_text_style,
    });
    gameOverText.anchor.set(0.5);
    restart.anchor.set(0.5);

    gameOverText.position.set(
      GAME_OVER_CONSTANTS.game_over_text_position.x,
      GAME_OVER_CONSTANTS.game_over_text_position.y
    );

    restart.position.set(
      GAME_OVER_CONSTANTS.restar_text_position.x,
      GAME_OVER_CONSTANTS.restar_text_position.y
    );

    restart.eventMode = "dynamic";

    this.container.addChild(bg, gameOverText, restart);
    this.container.pivot.set(
      this.container.width / 2,
      this.container.height / 2
    );

    this.container.position.set(
      GAME_OVER_CONSTANTS.container.x,
      GAME_OVER_CONSTANTS.container.y
    );
  }
}
