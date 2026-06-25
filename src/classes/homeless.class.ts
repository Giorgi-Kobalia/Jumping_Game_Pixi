import { Character } from "./character.class";
import { HOMELESS_ANIMATION, HOMELESS_CONSTANTS } from "../constants";
import { HomelessType } from "../types";

export class Homeless extends Character<HomelessType> {
  constructor() {
    super({
      defaultPosition: HOMELESS_CONSTANTS.container,
      defaultSize: HOMELESS_CONSTANTS.homeless,
      hitBox: { width: 30, height: 120, offsetX: -28 },
      animations: HOMELESS_ANIMATION,
      initialAnimation: HomelessType.WALK,
    });
  }
}
