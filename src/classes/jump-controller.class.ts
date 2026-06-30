export class JumpController {
  private jumpsUsed = 0;
  private jumpVelocity = 0;
  private readonly maxJumps = 2;

  constructor(
    private readonly gravity: number,
    private readonly jumpStrength: number
  ) {}

  get isJumping() {
    return this.jumpsUsed > 0;
  }

  jump(): boolean {
    if (this.jumpsUsed >= this.maxJumps) return false;
    this.jumpsUsed++;
    this.jumpVelocity = this.jumpStrength;
    return true;
  }

  reset() {
    this.jumpsUsed = 0;
    this.jumpVelocity = 0;
  }

  update(currentY: number, groundY: number): number {
    if (this.jumpsUsed === 0) return currentY;

    const nextY = currentY + this.jumpVelocity;
    this.jumpVelocity += this.gravity;

    if (nextY >= groundY) {
      this.jumpsUsed = 0;
      this.jumpVelocity = 0;
      return groundY;
    }

    return nextY;
  }
}
