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
  public soundIcon = new Sprite();

  public initialZombieSpeed = 8;
  public appearenceHomlessSpeed = 2;
  public appearenceZombieSpeed = 2;
  public zombieSpeed = this.initialZombieSpeed;
  public jumpCounter = 0;
  public isJumping = false;
  public gameWasStarted = false;
  public jumpVelocity = 0;
  public soundOn = false;
  public gravity = 0.5;
  public jumpStrength = -12;
  public gameOver?: boolean;

  public ticker = new Ticker();
  public start = new Text();

  init() {
    sound.add("my-sound", {
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

    this.gameOverPopUp.onClose = () => {
      this.resetGame();
    };

    this.moveZombie = this.moveZombie.bind(this);
    this.applyJumpPhysics = this.applyJumpPhysics.bind(this);
    this.paralaxAnimation = this.paralaxAnimation.bind(this);

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") this.handleJump();
    });

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

    this.start.on("pointerdown", () => {
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
    this.intro();
  }

  drawSoundIcon(value: boolean) {
    if (this.soundIcon) {
      this.container.removeChild(this.soundIcon);
    }
    console.log(1);

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
    if (this.gameOver || !this.gameWasStarted) return;

    if (!this.isJumping) {
      this.isJumping = true;
      this.jumpVelocity = this.jumpStrength;
      this.manJump();
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
        this.homeless.setAnimation(HomelessType.RUN);
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
    this.zombieIdle();
    this.gameWasStarted = false;
  };

  // ALL FUNCTIONS OF INTRO

  intro() {
    this.gameWasStarted = false;
    sound.play("my-sound");
    this.ticker.add(this.manAppearence);
  }

  manAppearence = () => {
    this.homeless.container.x += this.appearenceHomlessSpeed;
    if (this.homeless.container.x >= 350) {
      this.homeless.container.x = 350;
      this.ticker.remove(this.manAppearence);
      this.ticker.add(this.zombieAppearence);
      this.zombie.setAnimation(ZombieType.WALK);
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
    this.bg.homelessSpeachContainer.alpha = 1;
    this.bg.zombieSpeachContainer.alpha = 0;

    this.homeless.setAnimation(HomelessType.SPECIAL);
    if (this.homeless.sprite) {
      this.homeless.sprite.onComplete = () => {
        this.gameWasStarted = true;
        this.bg.homelessSpeachContainer.alpha = 0;
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

  manJump = () => {
    this.homeless.setAnimation(HomelessType.JUMP);
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
    let counter = 1;
    this.zombie.setAnimation(ZombieType.EAT);

    this.zombie.sprite.onComplete = () => {
      if (!this.zombie.sprite) return;

      if (counter < playEmount) {
        this.zombie.sprite.gotoAndPlay(0);
        counter++;
      } else {
        if (!gameOver) {
          this.bg.bodyContainer.alpha = 0;
          this.zombieIdle();
        } else {
          this.gameEnd();
        }
      }
    };
  };

  zombieIdle = () => {
    this.bg.zombieSpeachContainer.alpha = 1;
    this.zombie.setAnimation(ZombieType.IDLE);
    this.homeless.setAnimation(HomelessType.IDLE);
    setTimeout(() => {
      this.manSpecial();
    }, 2000);
  };

  zombieAttack = () => {
    this.zombie.setAnimation(ZombieType.ATTACK);
  };

  addDarkBg(value: number = 0) {
    this.darkBg.clear();
    this.darkBg
      .rect(0, 0, 1600, 566)

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
