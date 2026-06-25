import { Ticker } from "pixi.js";

export function tickerDelay(ticker: Ticker, ms: number): Promise<void> {
  return new Promise((resolve) => {
    let elapsed = 0;
    const tick = (tickerInstance: Ticker) => {
      elapsed += tickerInstance.deltaMS;
      if (elapsed >= ms) {
        ticker.remove(tick);
        resolve();
      }
    };
    ticker.add(tick);
  });
}
