import {
  Container,
  Graphics,
  Ticker,
  Text,
  Assets,
  Sprite,
} from "pixi.js";
import { Homeless, Zombie, Counter, GameOver, Bg } from ".";
import { ScoreManager } from "./score-manager.class";
import { JumpController } from "./jump-controller.class";
import {
  BG_CONSTANTS,
  ZOMBIE_CONSTANTS,
  HOMELESS_CONSTANTS,
  GAME_CONSTANTS,
} from "../constants";
import { HomelessType, ZombieType, GameState } from "../types";
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

  private state: GameState = GameState.IDLE;
  private scoreManager = new ScoreManager();

  public initialZombieSpeed = 8;
  public homelessAppearanceSpeed = 2;
  public zombieAppearanceSpeed = 2;
  public zombieSpeed = this.initialZombieSpeed;
  public soundOn = false;

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
    this.counter.updateCounter(0, this.scoreManager.highScore);

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
    this.state = GameState.INTRO;
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
      this.scoreManager.increment();
      this.counter.updateCounter(this.scoreManager.current, this.scoreManager.highScore);
      this.showMilestone(this.scoreManager.current);

      const { every, multiplier, max } = this.speedRamp;
      if (this.scoreManager.current > 0 && this.scoreManager.current % every === 0) {
        if (this.zombieSpeed < max) {
          this.zombieSpeed *= multiplier;
        }
      }
    }

    if (this.checkCollision()) {
      this.handleCollision();
    }
  };

  parallaxAnimation = () => {
    for (let i = 0; i < this.bg.bgElements.length; i++) {
      this.bg.bgElements[i].tilePosition.x -= this.zombieSpeed * BG_CONSTANTS[i].speed;
    }
  };

  handleJump() {
    if (this.state !== GameState.PLAYING) return;

    if (this.jumpController.jump()) {
      this.homeless.setAnimation(HomelessType.JUMP);
    }
  }

  applyJumpPhysics = () => {
    if (!this.jumpController.isJumping) return;

    this.homeless.container.y = this.jumpController.update(
      this.homeless.container.y,
      HOMELESS_CONSTANTS.container.y
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
    this.state = GameState.DYING;
    this.counter.container.visible = false;
    this.zombie.container.x += this.collisionKnockback;
    this.homeless.container.x -= this.collisionKnockback;
    this.homeless.container.y = HOMELESS_CONSTANTS.container.y;
    this.jumpController.reset();

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
    this.state = GameState.INTRO;
    this.jumpController.reset();
    this.scoreManager.reset();
    this.counter.updateCounter(0, this.scoreManager.highScore);
    this.gameOverPopUp.container.removeChildren();
    this.container.removeChild(this.darkBg);

    void this.runGreetingAndStart();
  };

  async runIntroSequence() {
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
    this.state = GameState.PLAYING;
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

    if (!this.darkBg.parent) {
      this.container.addChild(this.darkBg);
    }
  }

  addGameOverPopUp() {
    this.gameOverPopUp.drawGameOverPopUp(
      this.scoreManager.current,
      this.scoreManager.highScore
    );
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
    this.state = GameState.GAME_OVER;
    this.addDarkBg();
    this.addGameOverPopUp();
    this.ticker.add(this.makeDark);
  }

  private showMilestone(score: number) {
    if (score === 0 || score % 5 !== 0) return;

    const text = new Text({
      text: `${score}!`,
      style: {
        fontFamily: "Bungeespice Regular",
        fontSize: 100,
        fill: "#FFD700",
        stroke: { color: "#000000", width: 4 },
      },
    });

    text.anchor.set(0.5);
    text.position.set(GAME_CONSTANTS.width / 2, 120);
    text.alpha = 0;
    text.scale.set(0.5);
    this.container.addChild(text);

    let phase: "in" | "hold" | "out" = "in";
    let holdElapsed = 0;

    const animate = () => {
      if (phase === "in") {
        text.alpha = Math.min(1, text.alpha + 0.1);
        text.scale.set(Math.min(1, text.scale.x + 0.05));
        if (text.alpha >= 1) phase = "hold";
      } else if (phase === "hold") {
        holdElapsed += this.ticker.deltaMS;
        if (holdElapsed >= 400) phase = "out";
      } else {
        text.alpha = Math.max(0, text.alpha - 0.05);
        if (text.alpha <= 0) {
          this.ticker.remove(animate);
          this.container.removeChild(text);
          text.destroy();
        }
      }
    };

    this.ticker.add(animate);
  }
}
