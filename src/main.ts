import { Application, Assets } from "pixi.js";
import { Layout } from "./classes";
import { bg_manifest, homeless_manifest, zombie_manifest } from "./manifests";
import { sound } from "@pixi/sound";

const app = new Application();

let layout = new Layout();

const gameScene = document.getElementById("app");

function startGame() {
  sound.add("my-sound", {
    autoPlay: true,
    loop: true,
    url: "./sounds/sound1.mp3",
  });

  Assets.addBundle("images", {
    ...homeless_manifest,
    ...zombie_manifest,
    ...bg_manifest,
    CustomFontYellow: "./fonts/BungeeSpice-Regular.ttf",
  });

  Assets.loadBundle(["images"]).then(async () => {
    await app.init({
      width: 1600,
      height: 800,
      backgroundColor: "white",
      antialias: true,
    });

    layout.init();

    app.stage.addChild(layout.container);

    layout.container.pivot.y = layout.container.height / 2;

    layout.container.position.set(0, 400);

    gameScene?.appendChild(app.canvas);
    (globalThis as any).__PIXI_APP__ = app;
  });
}

startGame();
