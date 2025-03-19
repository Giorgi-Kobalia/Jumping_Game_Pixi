import { Container, Ticker, TilingSprite } from "pixi.js";
import { Homeless, Zombie, Counter, GameOver, Bg } from ".";
import {
  BG_CONSTANTS,
  ZOMBIE_CONSTANTS,
  HOMELESS_CONSTANTS,
} from "../constants";

export class Layout {
  public container = new Container();

  public homeless = new Homeless();
  public zombie = new Zombie();
  public counter = new Counter();
  public gameOverPopUp = new GameOver();
  public bg = new Bg();

  public initialZombieSpeed = 8;
  public zombieSpeed = this.initialZombieSpeed;
  public jumpCounter = 0;
  public isJumping = false;
  public jumpVelocity = 0;
  public gravity = 0.5;
  public jumpStrength = -11;
  public gameOver?: boolean;

  public ticker = new Ticker();

  init() {
    this.bg.init();
    this.homeless.init();
    this.zombie.init();
    this.counter.init();

    this.container.addChild(
      this.bg.container,
      this.homeless.container,
      this.zombie.container,
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
      this.moveZombie();
      this.applyJumpPhysics();
      this.paralaxAnimation();
    });
  }

  moveZombie() {
    this.zombie.container.x -= this.zombieSpeed;

    if (this.zombie.container.x + this.zombie.container.width < 0) {
      this.zombie.container.x = 1600;
      this.jumpCounter++;
      this.counter.updateCounter(this.jumpCounter);
      // if (this.jumpCounter && this.jumpCounter % 3 === 0) {
      //   if (this.zombieSpeed >= 20) return;
      //   this.zombieSpeed *= 1.1;
      // }
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
      const paralaxSpeed = BG_CONSTANTS[i].speed;
      const sprite = this.bg.bgElements[i] as TilingSprite;

      sprite.tilePosition.x -= this.zombieSpeed * paralaxSpeed;
    }
  }

  handleJump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.jumpVelocity = this.jumpStrength;
      this.homeless.sprite?.gotoAndPlay(0);
    }
  }

  applyJumpPhysics() {
    const speedFactor = this.zombieSpeed / this.initialZombieSpeed;

    if (this.isJumping) {
      this.homeless.container.y += this.jumpVelocity * speedFactor;
      this.jumpVelocity += this.gravity * speedFactor;

      if (this.homeless.container.y >= HOMELESS_CONSTANTS.container.y) {
        this.homeless.container.y = HOMELESS_CONSTANTS.container.y;
        this.isJumping = false;
      }
    }
  }

  checkCollision() {
    const homelessBounds = this.homeless.container.getBounds();
    const zombieBounds = this.zombie.container.getBounds();

    return (
      homelessBounds.x + homelessBounds.width > zombieBounds.x &&
      homelessBounds.x < zombieBounds.x + zombieBounds.width &&
      homelessBounds.y + homelessBounds.height > zombieBounds.y &&
      homelessBounds.y < zombieBounds.y + zombieBounds.height
    );
  }

  resetGame = () => {
    this.counter.container.visible = true;
    this.zombie.container.x = ZOMBIE_CONSTANTS.container.x;
    this.homeless.container.y = HOMELESS_CONSTANTS.container.y;
    this.zombieSpeed = this.initialZombieSpeed;
    this.gameOver = false;
    this.isJumping = false;
    this.jumpVelocity = 0;
    this.jumpCounter = 0;
    this.counter.updateCounter(this.jumpCounter);
    this.gameOverPopUp.container.removeChildren();
    this.ticker.start();
  };
}
