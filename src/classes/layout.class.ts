import { Container, Graphics, Ticker, TilingSprite } from "pixi.js";
import { Homeless, Zombie, Counter, GameOver, Bg } from ".";
import {
  BG_CONSTANTS,
  ZOMBIE_CONSTANTS,
  HOMELESS_CONSTANTS,
} from "../constants";
import { HomelessType, ZombieType } from "../types";
import { sound } from "@pixi/sound";

export class Layout {
  public container = new Container();

  public homeless = new Homeless();
  public zombie = new Zombie();
  public counter = new Counter();
  public gameOverPopUp = new GameOver();
  public bg = new Bg();
  public darkBg = new Graphics();

  public initialZombieSpeed = 8;
  public appearenceHomlessSpeed = 2;
  public appearenceZombieSpeed = 2;
  public zombieSpeed = this.initialZombieSpeed;
  public jumpCounter = 0;
  public isJumping = false;
  public jumpVelocity = 0;
  public gravity = 0.5;
  public jumpStrength = -12;
  public gameOver?: boolean;

  public ticker = new Ticker();

  init() {
    sound.add("my-sound", {
      autoPlay: true,
      loop: true,
      url: "./sounds/sound1.mp3",
    });

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

    this.moveZombie = this.moveZombie.bind(this);
    this.applyJumpPhysics = this.applyJumpPhysics.bind(this);
    this.paralaxAnimation = this.paralaxAnimation.bind(this);
  }

  gameLogic() {
    this.ticker.maxFPS = 90;
    this.ticker.start();

    this.intro();
  }

  moveZombie() {
    this.zombie.container.x -= this.zombieSpeed;

    if (this.zombie.container.x + this.zombie.container.width < 0) {
      this.zombie.container.x = ZOMBIE_CONSTANTS.container.x;
      this.jumpCounter++;
      this.counter.updateCounter(this.jumpCounter);
      if (this.jumpCounter && this.jumpCounter % 3 === 0) {
        if (this.zombieSpeed >= 20) return;
        this.zombieSpeed *= 1.1;
      }
    }

    if (this.checkCollision()) {
      this.gameOver = true;
      this.counter.container.visible = false;
      this.zombie.container.x += 20;
      this.homeless.container.x -= 20;
      this.homeless.container.y = HOMELESS_CONSTANTS.container.y;
      this.manHurt();
      this.zombieAttack();
      this.ticker.remove(this.applyJumpPhysics);
      this.ticker.remove(this.moveZombie);
      this.ticker.remove(this.paralaxAnimation);
    }
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
    }
  }

  applyJumpPhysics = () => {
    const speedFactor = this.zombieSpeed / this.initialZombieSpeed;

    if (this.isJumping) {
      this.homeless.container.y += this.jumpVelocity * speedFactor;
      this.jumpVelocity += this.gravity * speedFactor;

      if (this.homeless.container.y >= HOMELESS_CONSTANTS.container.y) {
        this.homeless.container.y = HOMELESS_CONSTANTS.container.y;
        this.isJumping = false;
      }
    }
  };

  checkCollision() {
    const homelessBounds = this.homeless.hitBoxContainer.getBounds();
    const zombieBounds = this.zombie.hitBoxContainer.getBounds();

    return (
      homelessBounds.x + homelessBounds.width > zombieBounds.x &&
      homelessBounds.x < zombieBounds.x + zombieBounds.width &&
      homelessBounds.y + homelessBounds.height > zombieBounds.y &&
      homelessBounds.y < zombieBounds.y + zombieBounds.height
    );
  }

  resetGame = () => {
    this.counter.container.visible = true;
    this.zombie.container.x = 1500;
    this.homeless.container.x = 350;
    this.zombieSpeed = this.initialZombieSpeed;
    this.gameOver = false;
    this.isJumping = false;
    this.jumpVelocity = 0;
    this.jumpCounter = 0;
    this.counter.updateCounter(this.jumpCounter);
    this.gameOverPopUp.container.removeChildren();
    this.container.removeChild(this.darkBg);
    this.intro();
  };

  // ALL FUNCTIONS OF INTRO

  intro() {
    this.ticker.add(this.manAppearence);
    // this.zombie.setAnimation(ZombieType.WALK);
    // this.homeless.setAnimation(HomelessType.WALK);
  }

  manAppearence = () => {
    this.homeless.container.x += this.appearenceHomlessSpeed;
    if (this.homeless.container.x >= 350) {
      this.homeless.container.x = 350;
      this.ticker.remove(this.manAppearence);
      this.ticker.add(this.zombieAppearence);
      this.manDrinkAndIdle();
    }
  };

  manDrinkAndIdle = () => {
    this.homeless.setAnimation(HomelessType.DRINK);
    if (this.homeless.sprite) {
      this.homeless.sprite.onComplete = () => {
        this.homeless.setAnimation(HomelessType.IDLE);
      };
    }
  };

  manSpecial = () => {
    this.homeless.setAnimation(HomelessType.SPECIAL);
    if (this.homeless.sprite) {
      this.homeless.sprite.onComplete = () => {
        this.zombie.setAnimation(ZombieType.RUN);
        this.homeless.setAnimation(HomelessType.RUN);
        this.ticker.add(this.applyJumpPhysics);
        this.ticker.add(this.moveZombie);
        this.ticker.add(this.paralaxAnimation);
      };
    }
  };

  manHurt = () => {
    this.homeless.setAnimation(HomelessType.HURT);
    if (this.homeless.sprite) {
      this.homeless.sprite.onComplete = () => {
        this.manDead();
      };
    }
  };

  manDead = () => {
    this.homeless.setAnimation(HomelessType.DEAD);

    if (this.homeless.sprite) {
      this.homeless.sprite.onComplete = () => {
        this.zombieEat(2, this.gameOver);
      };
    }
  };

  // ZOMBIE

  zombieAppearence = () => {
    this.zombie.container.x -= this.appearenceZombieSpeed;
    if (this.zombie.container.x <= 1500) {
      this.zombie.container.x = 1500;
      this.ticker.remove(this.zombieAppearence);
      this.zombieEat(2, this.gameOver);
    }
  };

  zombieEat = (playEmount: number, gameOver?: boolean) => {
    if (!this.zombie.sprite) return;

    let counter = 0;
    this.zombie.setAnimation(ZombieType.EAT);

    this.zombie.sprite.onComplete = () => {
      if (!this.zombie.sprite) return;

      if (counter < playEmount) {
        this.zombie.sprite.gotoAndPlay(0);
        counter++;
      } else {
        if (!gameOver) {
          this.zombieIdle();
        } else {
          this.gameEnd();
        }
      }
    };
  };

  zombieIdle = () => {
    this.zombie.setAnimation(ZombieType.IDLE);
    this.homeless.setAnimation(HomelessType.IDLE);
    setTimeout(() => {
      this.manSpecial();
    }, 1000);
  };

  zombieAttack = () => {
    this.zombie.setAnimation(ZombieType.ATTACK);
  };

  addDarkBg() {
    this.darkBg.clear();
    this.darkBg
      .rect(0, 80, this.container.width, this.container.height)
      .fill("black");
    this.darkBg.alpha = 0;

    this.container.addChild(this.darkBg);
  }

  addGameOverPopUp() {
    this.gameOverPopUp.drawGameOverPopUp(this.jumpCounter);
    this.container.addChild(this.gameOverPopUp.container);
  }

  makeDark = () => {
    if (this.darkBg.alpha < 0.7) {
      this.darkBg.alpha += 0.05;
    } else {
      this.ticker.remove(this.makeDark);
    }
  };

  gameEnd() {
    this.addDarkBg();
    this.addGameOverPopUp();
    this.ticker.add(this.makeDark);
  }
}
