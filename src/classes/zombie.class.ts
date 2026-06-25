import { Character } from "./character.class";
import { ZOMBIE_ANIMATION, ZOMBIE_CONSTANTS } from "../constants";
import { ZombieType } from "../types";

export class Zombie extends Character<ZombieType> {
  constructor() {
    super({
      defaultPosition: ZOMBIE_CONSTANTS.container,
      defaultSize: ZOMBIE_CONSTANTS.zombie,
      hitBox: { width: 30, height: 100, offsetX: -50 },
      animations: ZOMBIE_ANIMATION,
      initialAnimation: ZombieType.WALK,
      mirrored: true,
    });
  }
}
