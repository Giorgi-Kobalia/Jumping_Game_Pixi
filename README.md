# Jumping Game (PixiJS)

A small 2D endless-runner built with [PixiJS](https://pixijs.com/) 8 and TypeScript. A homeless character runs from a chasing zombie; jump over obstacles, rack up score, and survive as long as you can.

Play it live: deployed via GitHub Pages from this repo's `main` branch.

## Tech Stack

- [PixiJS](https://pixijs.com/) 8 — WebGL/WebGPU 2D rendering
- [@pixi/sound](https://github.com/pixijs/sound) — audio playback
- TypeScript (strict mode)
- [Vite](https://vitejs.dev/) — dev server & bundler

## Getting Started

```bash
npm install
npm run dev
```

Open the printed local URL in your browser. The game auto-starts loading assets and shows a **START** button once ready.

## Scripts

| Command           | Description                              |
| ------------------ | ----------------------------------------- |
| `npm run dev`       | Start the Vite dev server with HMR        |
| `npm run build`     | Type-check (`tsc`) and build for production|
| `npm run preview`   | Preview the production build locally      |

## Controls

- **Space** or **tap/click** the game area — jump
- Click anywhere on the page — request fullscreen
- Rotate your device to landscape on mobile (the game pauses and prompts you to rotate when in portrait)

## Project Structure

```
src/
  classes/      Game entities and core game loop (Character, Homeless, Zombie, Layout, Bg, Counter, GameOver, JumpController)
  constants/    Tunable gameplay/visual constants per entity
  functions/    Small reusable helpers (tiling sprites, screen fit, animation/ticker promises)
  manifests/    Asset bundle manifests passed to PixiJS Assets
  types/        Shared TypeScript types and enums
  main.ts       App bootstrap: asset loading, responsive scaling, input wiring
public/
  images/, fonts/, sounds/   Game assets
```

The game world is built at a fixed design resolution (`GAME_CONSTANTS`) and scaled to fit the viewport at runtime (see `src/functions/fit-to-screen.ts`), so the canvas fills the screen on any device while keeping the original layout proportions.

## Deployment

A GitHub Actions workflow (`.github/workflows/static.yml`) builds the project and deploys the `dist/` output to GitHub Pages on every push to `main`.
