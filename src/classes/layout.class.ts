import { Container, Ticker } from "pixi.js";
import { Cat, Cactus, Counter, GameOver } from ".";
import { CACTUS_CONSTANTS, CAT_CONSTANTS } from "../constants";

export class Layout {
  public container = new Container();

  public cat = new Cat();
  public cactus = new Cactus();
  public counter = new Counter();
  public gameOverPopUp = new GameOver();

  public cactusSpeed = CACTUS_CONSTANTS.cactus.speed;
  public jumpCounter = 0;
  public isJumping = false;
  public jumpVelocity = 0;
  public gravity = 0.5;
  public jumpStrength = -15;
  public gameOver?: boolean;

  public ticker = new Ticker();

  init() {
    this.cat.init();
    this.cactus.init();
    this.counter.init();

    this.container.addChild(
      this.cat.container,
      this.cactus.container,
      this.counter.container
    );

    this.gameLogic();

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") this.handleJump();
    });

    this.gameOverPopUp.onClose = () => {
      this.resetGame();
    };
  }

  gameLogic() {
    this.ticker.start();

    this.ticker.add(() => {
      this.moveCactus();
      this.applyJumpPhysics();
    });
  }

  moveCactus() {
    this.cactus.container.x -= this.cactusSpeed;

    if (this.cactus.container.x + this.cactus.container.width < 0) {
      this.cactus.container.x = 1600;
      this.jumpCounter++;
      this.counter.updateCounter(this.jumpCounter);
    }

    if (this.checkCollision()) {
      this.gameOver = true;
      this.gameOverPopUp.drawGameOverPopUp(this.jumpCounter);
      this.container.addChild(this.gameOverPopUp.container);
      this.ticker.stop();
    }
  }

  handleJump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.jumpVelocity = this.jumpStrength;
    }
  }

  applyJumpPhysics() {
    if (this.isJumping) {
      this.cat.container.y += this.jumpVelocity;
      this.jumpVelocity += this.gravity;

      if (this.cat.container.y >= CAT_CONSTANTS.container.y) {
        this.cat.container.y = CAT_CONSTANTS.container.y;
        this.isJumping = false;
      }
    }
  }

  checkCollision() {
    const catBounds = this.cat.container.getBounds();
    const cactusBounds = this.cactus.container.getBounds();

    return (
      catBounds.x + catBounds.width > cactusBounds.x &&
      catBounds.x < cactusBounds.x + cactusBounds.width &&
      catBounds.y + catBounds.height > cactusBounds.y &&
      catBounds.y < cactusBounds.y + cactusBounds.height
    );
  }

  resetGame = () => {
    this.cactus.container.x = CACTUS_CONSTANTS.container.x;
    this.cat.container.y = CAT_CONSTANTS.container.y;
    this.cactusSpeed = CACTUS_CONSTANTS.cactus.speed;
    this.gameOver = false;
    this.isJumping = false;
    this.jumpVelocity = 0;
    this.jumpCounter = 0;
    this.counter.updateCounter(this.jumpCounter);
    this.gameOverPopUp.container.removeChildren();
    this.ticker.start();
  };
}
