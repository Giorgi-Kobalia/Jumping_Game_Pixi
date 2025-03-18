import { Application, Assets } from "pixi.js";

import { Layout } from "./classes";
const app = new Application();

let layout = new Layout();

const gameScene = document.getElementById("app");

async function startGame() {
  Assets.addBundle("images", {
    cat: "./images/cat.png",
    cactus: "./images/cactus.png",
    sky1: "./images/sky1.png",
    sky2: "./images/sky2.png",
    bush1: "./images/bush1.png",
    bush2: "./images/bush2.png",
  });

  await Assets.loadBundle(["images"]);

  await app.init({
    width: 1600,
    height: 800,
    backgroundColor: "white",
    antialias: true,
  });

  layout.init();

  app.stage.addChild(layout.container);

  gameScene?.appendChild(app.canvas);
  (globalThis as any).__PIXI_APP__ = app;
}

startGame();
