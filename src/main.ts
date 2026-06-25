import { Application, Assets } from "pixi.js";
import { Layout } from "./classes";
import { bg_manifest, homeless_manifest, zombie_manifest } from "./manifests";
import { fitToScreen } from "./functions";
import { GAME_CONSTANTS } from "./constants";
import { sound } from "@pixi/sound";

const app = new Application();
const layout = new Layout();
const gameScene = document.getElementById("app");
const rotateMessage = document.getElementById("rotate-message");

function checkOrientation() {
  if (window.innerWidth < window.innerHeight) {
    gameScene?.classList.add("hiden");
    rotateMessage?.classList.remove("hiden");
    layout.pauseGame();
  } else {
    gameScene?.classList.remove("hiden");
    rotateMessage?.classList.add("hiden");
    layout.resumeGame();
  }
}

function handleResize() {
  checkOrientation();
  fitToScreen({
    container: layout.container,
    designWidth: GAME_CONSTANTS.width,
    designHeight: GAME_CONSTANTS.height,
  });
}

window.addEventListener("resize", handleResize);
window.addEventListener("orientationchange", handleResize);
handleResize();

function goFullscreen() {
  const elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem
      .requestFullscreen()
      .catch((err) => console.warn("Fullscreen request failed:", err));
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

document.addEventListener("click", goFullscreen, { once: true });

async function startGame() {
  Assets.addBundle("sprites", {
    ...homeless_manifest,
    ...zombie_manifest,
    ...bg_manifest,
  });

  Assets.addBundle("media", {
    CustomFontYellow: "./fonts/BungeeSpice-Regular.ttf",
    music: "./sounds/sound1.mp3",
  });

  try {
    await Assets.loadBundle(["sprites", "media"]);

    await app.init({
      resizeTo: window,
      resolution: Math.max(window.devicePixelRatio, 1),
      autoDensity: true,
      backgroundAlpha: 0,
      antialias: true,
    });

    sound.add("my-sound", {
      loop: true,
      url: Assets.get("music").url,
    });

    layout.init();
    layout.container.eventMode = "dynamic";
    app.stage.addChild(layout.container);
    gameScene?.appendChild(app.canvas);
    globalThis.__PIXI_APP__ = app;

    handleResize();

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") layout.handleJump();
    });

    layout.container.on("pointertap", () => {
      layout.handleJump();
    });
  } catch (err) {
    console.error("Failed to load game assets:", err);
    if (gameScene) {
      gameScene.textContent = "Failed to load the game. Please refresh the page.";
    }
  }
}

startGame();
