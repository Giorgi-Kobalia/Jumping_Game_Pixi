import { Application, Assets } from "pixi.js";

import { Layout } from "./classes";
const app = new Application();

let layout = new Layout();

const gameScene = document.getElementById("app");

async function startGame() {
  Assets.addBundle("images", {
    idle: "./images/homeless/idle.json",
    cactus: "./images/cactus.png",

    ground: "./images/bg/layer_1_ground.png",
    stars: "./images/bg/layer_2_stars.png",
    moon: "./images/bg/layer_3_moon.png",
    clouds1: "./images/bg/layer_4_clouds_1.png",
    clouds2: "./images/bg/layer_5_clouds_2.png",
    farBuildings: "./images/bg/layer_6_far_buildings.png",
    bgBuildings: "./images/bg/layer_7_bg_buildings.png",
    fgBuildings: "./images/bg/layer_8_fg_buildings.png",
    wall: "./images/bg/layer_9_wall.png",
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

  layout.container.pivot.set(
    layout.container.width / 2,
    layout.container.height / 2
  );

  layout.container.position.set(800, 400);

  gameScene?.appendChild(app.canvas);
  (globalThis as any).__PIXI_APP__ = app;
}

startGame();
