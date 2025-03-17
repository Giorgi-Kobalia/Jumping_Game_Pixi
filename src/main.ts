import { Application, Assets } from "pixi.js";

import { Layout } from "./classes";
const app = new Application();

let layout = new Layout();

const gameScene = document.getElementById("app");

async function startGame() {
  Assets.addBundle("images", {
    cat: "./images/cat.png",
    cactus: "./images/cactus.png",
  });

  await Assets.loadBundle(["images"]);

  await app.init({
    width: 1600,
    height: 800,
    backgroundColor: 0x87ceeb,
    antialias: true,
  });

  layout.init();

  app.stage.addChild(layout.container);

  gameScene?.appendChild(app.canvas);
  (globalThis as any).__PIXI_APP__ = app;
}

startGame();
