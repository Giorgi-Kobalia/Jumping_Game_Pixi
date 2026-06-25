import {
  Container,
  Graphics,
  Ticker,
  TilingSprite,
  Text,
  Assets,
  Sprite,
} from "pixi.js";
import { Homeless, Zombie, Counter, GameOver, Bg } from ".";
import { JumpController } from "./jump-controller.class";
import {
  BG_CONSTANTS,
  ZOMBIE_CONSTANTS,
  HOMELESS_CONSTANTS,
  GAME_CONSTANTS,
} from "../constants";
import { HomelessType, ZombieType } from "../types";
import { playAnimationAndWait, tickerDelay } from "../functions";
import { sound } from "@pixi/sound";

export class Layout {
  public container = new Container();

  public homeless = new Homeless();
  public zombie = new Zombie();
  public counter = new Counter();
  public gameOverPopUp = new GameOver();
  public bg = new Bg();
  public darkBg = new Graphics();
  public soundIcon = new Sprite();

  public initialZombieSpeed = 8;
  public homelessAppearanceSpeed = 2;
  public zombieAppearanceSpeed = 2;
  public zombieSpeed = this.initialZombieSpeed;
  public jumpCounter = 0;
  public gameWasStarted = false;
  public soundOn = false;
  public gameOver = false;

  private readonly homelessRunInX = 350;
  private readonly zombieIdleX = 1500;
  private readonly collisionKnockback = 20;
  private readonly speedRamp = { every: 3, multiplier: 1.1, max: 20 };

  public jumpController = new JumpController(0.5, -12);

  public ticker = new Ticker();
  public start = new Text();

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

    this.gameOverPopUp.onClose = () => {
      this.resetGame();
    };

    this.firstStart();
  }

  firstStart() {
    this.addDarkBg(0.5);
    this.drawStartBtn();
  }

  drawStartBtn() {
    this.start = new Text({
      text: `START`,
      style: {
        fontFamily: "Bungeespice Regular",
        fontSize: 140,
        fill: "black",
        lineHeight: 140,
      },
    });

    this.start.eventMode = "dynamic";
    this.start.cursor = "pointer";

    this.start.pivot.set(this.start.width / 2, this.start.height / 2);
    this.start.position.set(this.darkBg.width / 2, this.darkBg.height / 1.4);

    this.container.addChild(this.start);

    this.start.on("pointertap", () => {
      this.soundOn = !this.soundOn;
      this.gameLogic();
    });
  }

  gameLogic() {
    this.container.removeChild(this.start);
    this.container.removeChild(this.darkBg);
    this.drawSoundIcon(this.soundOn);
    this.ticker.maxFPS = 60;
    this.ticker.start();
    void this.runIntroSequence();
  }

  pauseGame() {
    this.ticker.stop();
    if (sound.isPlaying() === true) {
      sound.muteAll();
    }
  }

  resumeGame() {
    this.ticker.start();
    sound.unmuteAll();
  }

  drawSoundIcon(value: boolean) {
    if (this.soundIcon) {
      this.container.removeChild(this.soundIcon);
    }

    this.soundIcon = new Sprite(Assets.get(`sound_${value}`));
    this.soundIcon.position.set(10, 10);
    this.soundIcon.eventMode = "dynamic";
    this.soundIcon.cursor = "pointer";
    this.soundIcon.width = 50;
    this.soundIcon.height = 50;
    this.soundIcon.on("pointerdown", () => {
      this.soundOn = !this.soundOn;
      this.drawSoundIcon(this.soundOn);
      if (this.soundOn) {
        sound.unmuteAll();
      } else {
        sound.muteAll();
      }
    });
    this.container.addChild(this.soundIcon);
  }

  moveZombie = () => {
    this.zombie.container.x -= this.zombieSpeed;

    if (this.zombie.container.x + this.zombie.container.width < 0) {
      this.zombie.container.x = ZOMBIE_CONSTANTS.container.x;
      this.jumpCounter++;
      this.counter.updateCounter(this.jumpCounter);

      const { every, multiplier, max } = this.speedRamp;
      if (this.jumpCounter && this.jumpCounter % every === 0) {
        if (this.zombieSpeed >= max) return;
        this.zombieSpeed *= multiplier;
      }
    }

    if (this.checkCollision()) {
      this.handleCollision();
    }
  };

  parallaxAnimation = () => {
    for (let i = 0; i < this.bg.bgElements.length; i++) {
      const parallaxSpeed = BG_CONSTANTS[i].speed;
      const sprite = this.bg.bgElements[i] as TilingSprite;

      sprite.tilePosition.x -= this.zombieSpeed * parallaxSpeed;
    }
  };

  handleJump() {
    if (this.gameOver || !this.gameWasStarted) return;

    if (this.jumpController.jump()) {
      this.homeless.setAnimation(HomelessType.JUMP);
    }
  }

  applyJumpPhysics = () => {
    if (!this.jumpController.isJumping) return;

    const speedFactor = this.zombieSpeed / this.initialZombieSpeed;
    this.homeless.container.y = this.jumpController.update(
      this.homeless.container.y,
      HOMELESS_CONSTANTS.container.y,
      speedFactor
    );

    if (!this.jumpController.isJumping) {
      this.homeless.setAnimation(HomelessType.RUN);
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

  handleCollision() {
    this.gameOver = true;
    this.counter.container.visible = false;
    this.zombie.container.x += this.collisionKnockback;
    this.homeless.container.x -= this.collisionKnockback;
    this.homeless.container.y = HOMELESS_CONSTANTS.container.y;

    this.zombie.setAnimation(ZombieType.ATTACK);

    this.ticker.remove(this.applyJumpPhysics);
    this.ticker.remove(this.moveZombie);
    this.ticker.remove(this.parallaxAnimation);

    void this.runDeathSequence();
  }

  resetGame = () => {
    this.counter.container.visible = true;
    this.zombie.container.x = this.zombieIdleX;
    this.homeless.container.x = this.homelessRunInX;
    this.zombieSpeed = this.initialZombieSpeed;
    this.gameOver = false;
    this.jumpController.reset();
    this.jumpCounter = 0;
    this.counter.updateCounter(this.jumpCounter);
    this.gameOverPopUp.container.removeChildren();
    this.container.removeChild(this.darkBg);
    this.gameWasStarted = false;

    void this.runGreetingAndStart();
  };

  async runIntroSequence() {
    this.gameWasStarted = false;
    sound.play("my-sound");

    await this.moveHomelessIn();
    this.zombie.setAnimation(ZombieType.WALK);
    void this.playHomelessDrinkThenIdle();

    await this.moveZombieIn();
    await this.playZombieEating(2);

    this.bg.bodyContainer.alpha = 0;
    await this.runGreetingAndStart();
  }

  private async runGreetingAndStart() {
    await this.playZombieIdleGreeting();
    await this.playHomelessSpecialIntro();
    this.beginRun();
  }

  private moveHomelessIn(): Promise<void> {
    return new Promise((resolve) => {
      const step = () => {
        this.homeless.container.x += this.homelessAppearanceSpeed;
        if (this.homeless.container.x >= this.homelessRunInX) {
          this.homeless.container.x = this.homelessRunInX;
          this.ticker.remove(step);
          resolve();
        }
      };
      this.ticker.add(step);
    });
  }

  private moveZombieIn(): Promise<void> {
    return new Promise((resolve) => {
      const step = () => {
        this.zombie.container.x -= this.zombieAppearanceSpeed;
        if (this.zombie.container.x <= this.zombieIdleX) {
          this.zombie.container.x = this.zombieIdleX;
          this.ticker.remove(step);
          resolve();
        }
      };
      this.ticker.add(step);
    });
  }

  private async playHomelessDrinkThenIdle() {
    this.homeless.setAnimation(HomelessType.DRINK);
    if (!this.homeless.sprite) return;
    await playAnimationAndWait(this.homeless.sprite);
    this.homeless.setAnimation(HomelessType.IDLE);
  }

  private async playHomelessSpecialIntro() {
    this.bg.homelessSpeechContainer.alpha = 1;
    this.bg.zombieSpeechContainer.alpha = 0;

    this.homeless.setAnimation(HomelessType.SPECIAL);
    if (!this.homeless.sprite) return;
    await playAnimationAndWait(this.homeless.sprite);
    this.bg.homelessSpeechContainer.alpha = 0;
  }

  private beginRun() {
    this.gameWasStarted = true;
    this.zombie.setAnimation(ZombieType.RUN);
    this.homeless.setAnimation(HomelessType.RUN);
    this.ticker.add(this.applyJumpPhysics);
    this.ticker.add(this.moveZombie);
    this.ticker.add(this.parallaxAnimation);
  }

  private playZombieEating(times: number): Promise<void> {
    return new Promise((resolve) => {
      this.zombie.setAnimation(ZombieType.EAT);
      if (!this.zombie.sprite) {
        resolve();
        return;
      }

      let count = 1;
      this.zombie.sprite.onComplete = () => {
        if (!this.zombie.sprite) {
          resolve();
          return;
        }

        if (count < times) {
          this.zombie.sprite.gotoAndPlay(0);
          count++;
        } else {
          resolve();
        }
      };
    });
  }

  private async playZombieIdleGreeting() {
    this.bg.zombieSpeechContainer.alpha = 1;
    this.zombie.setAnimation(ZombieType.IDLE);
    this.homeless.setAnimation(HomelessType.IDLE);
    await tickerDelay(this.ticker, 2000);
  }

  private async runDeathSequence() {
    this.homeless.setAnimation(HomelessType.HURT);
    if (this.homeless.sprite) {
      await playAnimationAndWait(this.homeless.sprite);
    }

    this.homeless.setAnimation(HomelessType.DEAD);
    if (this.homeless.sprite) {
      await playAnimationAndWait(this.homeless.sprite);
    }

    await this.playZombieEating(2);

    this.gameEnd();
  }

  addDarkBg(value: number = 0) {
    this.darkBg.clear();
    this.darkBg
      .rect(0, 0, GAME_CONSTANTS.width, GAME_CONSTANTS.height)
      .fill("black");
    this.darkBg.alpha = value;

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
