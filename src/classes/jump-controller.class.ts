export class JumpController {
  private jumping = false;
  private jumpVelocity = 0;

  constructor(
    private readonly gravity: number,
    private readonly jumpStrength: number
  ) {}

  get isJumping() {
    return this.jumping;
  }

  jump(): boolean {
    if (this.jumping) return false;
    this.jumping = true;
    this.jumpVelocity = this.jumpStrength;
    return true;
  }

  reset() {
    this.jumping = false;
    this.jumpVelocity = 0;
  }

  update(currentY: number, groundY: number, speedFactor: number): number {
    if (!this.jumping) return currentY;

    const nextY = currentY + this.jumpVelocity * speedFactor;
    this.jumpVelocity += this.gravity * speedFactor;

    if (nextY >= groundY) {
      this.jumping = false;
      return groundY;
    }

    return nextY;
  }
}
