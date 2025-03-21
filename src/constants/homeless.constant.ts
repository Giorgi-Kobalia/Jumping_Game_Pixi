import { HomelessType } from "../types";

export const HOMELESS_CONSTANTS = {
  homeless: {
    width: 256,
    height: 256,
  },
  container: {
    x: -135,
    y: 490,
  },
};

export const HOMELESS_ANIMATION = {
  [HomelessType.WALK]: {
    animationSpeed: 0.2,
    loop: true,
    gotoAndPlay: 0,
  },
  [HomelessType.IDLE]: {
    animationSpeed: 0.1,
    loop: true,
    gotoAndPlay: 0,
  },
  [HomelessType.DRINK]: {
    animationSpeed: 0.1,
    loop: false,
    gotoAndPlay: 0,
  },
  [HomelessType.SPECIAL]: {
    animationSpeed: 0.2,
    loop: false,
    gotoAndPlay: 0,
  },
  [HomelessType.RUN]: {
    animationSpeed: 0.2,
    loop: true,
    gotoAndPlay: 0,
  },
  [HomelessType.JUMP]: {
    animationSpeed: 0.1,
    loop: false,
    gotoAndPlay: 0,
  },
  [HomelessType.HURT]: {
    animationSpeed: 0.2,
    loop: false,
    gotoAndPlay: 0,
  },
  [HomelessType.DEAD]: {
    animationSpeed: 0.2,
    loop: false,
    gotoAndPlay: 0,
  },
};
