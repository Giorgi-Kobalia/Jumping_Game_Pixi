import { Container, Ticker, TilingSprite } from "pixi.js";
import { Cat, Cactus, Counter, GameOver, Bg } from ".";
import { bgObjects, CACTUS_CONSTANTS, CAT_CONSTANTS } from "../constants";

export class Layout {
  public container = new Container();

  public cat = new Cat();
  public cactus = new Cactus();
  public counter = new Counter();
  public gameOverPopUp = new GameOver();
  public bg = new Bg();

  public initialCactusSpeed = 8;
  public cactusSpeed = this.initialCactusSpeed;
  public jumpCounter = 0;
  public isJumping = false;
  public jumpVelocity = 0;
  public gravity = 0.5;
  public jumpStrength = -15;
  public gameOver?: boolean;

  public ticker = new Ticker();

  init() {
    this.bg.init();
    this.cat.init();
    this.cactus.init();
    this.counter.init();

    this.container.addChild(
      this.bg.container,
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
    this.ticker.maxFPS = 90;
    this.ticker.start();

    this.ticker.add(() => {
      // this.moveCactus();
      this.applyJumpPhysics();
      this.paralaxAnimation();
    });
  }

  moveCactus() {
    this.cactus.container.x -= this.cactusSpeed;

    if (this.cactus.container.x + this.cactus.container.width < 0) {
      this.cactus.container.x = 1600;
      this.jumpCounter++;
      this.counter.updateCounter(this.jumpCounter);
      if (this.jumpCounter && this.jumpCounter % 3 === 0) {
        if (this.cactusSpeed >= 20) return;
        this.cactusSpeed *= 1.1;
      }
    }

    // if (this.checkCollision()) {
    //   this.gameOver = true;
    //   this.counter.container.visible = false;
    //   this.gameOverPopUp.drawGameOverPopUp(this.jumpCounter);
    //   this.container.addChild(this.gameOverPopUp.container);
    //   this.ticker.stop(); 
    // }
  }

  paralaxAnimation() {
    for (let i = 0; i < this.bg.bgElements.length; i++) {
      const paralaxSpeed = bgObjects[i].speed;
      const sprite = this.bg.bgElements[i] as TilingSprite;

      sprite.tilePosition.x -= this.cactusSpeed * paralaxSpeed;
    }
  }

  handleJump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.jumpVelocity = this.jumpStrength;
    }
  }

  applyJumpPhysics() {
    const speedFactor = this.cactusSpeed / this.initialCactusSpeed;

    if (this.isJumping) {
      this.cat.container.y += this.jumpVelocity * speedFactor;
      this.jumpVelocity += this.gravity * speedFactor;

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
    this.counter.container.visible = true;
    this.cactus.container.x = CACTUS_CONSTANTS.container.x;
    this.cat.container.y = CAT_CONSTANTS.container.y;
    this.cactusSpeed = this.initialCactusSpeed;
    this.gameOver = false;
    this.isJumping = false;
    this.jumpVelocity = 0;
    this.jumpCounter = 0;
    this.counter.updateCounter(this.jumpCounter);
    this.gameOverPopUp.container.removeChildren();
    this.ticker.start();
  };
}
