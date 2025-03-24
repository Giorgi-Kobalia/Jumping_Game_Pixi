import { Application, Assets } from "pixi.js";
import { Layout } from "./classes";
import { bg_manifest, homeless_manifest, zombie_manifest } from "./manifests";
import { sound } from "@pixi/sound";

const app = new Application();

let layout = new Layout();

const gameScene = document.getElementById("app");

function startGame() {
  Assets.addBundle("images", {
    ...homeless_manifest,
    ...zombie_manifest,
    ...bg_manifest,
    CustomFontYellow: "./fonts/BungeeSpice-Regular.ttf",
    music: "./sounds/sound1.mp3",
  });

  Assets.loadBundle(["images"]).then(async () => {
    await app.init({
      width: 1600,
      height: 566,
      backgroundColor: "white",
      antialias: true,
    });

    sound.add("my-sound", {
      loop: true,
      url: Assets.get("music").url,
    });

    layout.init();

    app.stage.addChild(layout.container);

    gameScene?.appendChild(app.canvas);
    (globalThis as any).__PIXI_APP__ = app;
  });
}

startGame();
