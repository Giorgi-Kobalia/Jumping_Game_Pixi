const STORAGE_KEY = "jumping_game_high_score";

export class ScoreManager {
  private _current = 0;
  private _highScore: number;

  constructor() {
    this._highScore = parseInt(localStorage.getItem(STORAGE_KEY) ?? "0", 10);
  }

  get current() {
    return this._current;
  }

  get highScore() {
    return this._highScore;
  }

  increment() {
    this._current++;
    if (this._current > this._highScore) {
      this._highScore = this._current;
      localStorage.setItem(STORAGE_KEY, String(this._highScore));
    }
  }

  reset() {
    this._current = 0;
  }
}
