import { ZombieType } from "../types";

export const ZOMBIE_CONSTANTS = {
  zombie: {
    width: 196,
    height: 196,
  },
  container: {
    x: 1700,
    y: 440,
  },
};

export const ZOMBIE_ANIMATION = {
  [ZombieType.ATTACK]: {
    animationSpeed: 0.2,
    loop: false,
    gotoAndPlay: 0,
  },
  [ZombieType.EAT]: {
    animationSpeed: 0.2,
    loop: false,
    gotoAndPlay: 0,
  },
  [ZombieType.RUN]: {
    animationSpeed: 0.2,
    loop: true,
    gotoAndPlay: 0,
  },
  [ZombieType.IDLE]: {
    animationSpeed: 0.2,
    loop: true,
    gotoAndPlay: 0,
  },
  [ZombieType.WALK]: {
    animationSpeed: 0.2,
    loop: true,
    gotoAndPlay: 0,
  },
};
