<h1 align="center">AirMesh</h1>

<p align="center">
  <a href="https://arvanj.github.io/airmesh/media/airmesh-launch.mp4"><img src="media/airmesh-preview.gif" width="760" alt="AirMesh launch video: neon strings between hands, a portal that makes you vanish, a hand-played synth, a turning night sky with hand-drawn constellations, a keep-up game and an exploding F1 hologram"></a>
  <br><sub>▶ Click for the full narrated launch video with sound</sub>
</p>

<p align="center"><b>Browser hand-tracking playground built by <a href="https://github.com/ArvanJ">@ArvanJ</a>, turning any webcam into an <a href="https://arvanj.github.io/airmesh/">Iron Man–style holographic workshop</a></b></p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-2ea44f" alt="status: active">
  <img src="https://img.shields.io/badge/runtime-browser%20·%20no%20install-1f6feb" alt="runtime: browser, no install">
  <img src="https://img.shields.io/badge/vision-MediaPipe%20hands%20%2B%20segmentation-b7791f" alt="vision: MediaPipe hands + segmentation">
  <img src="https://img.shields.io/badge/stack-Web%20Audio%20%2B%20Canvas-24364b" alt="stack: Web Audio + Canvas">
</p>

<p align="center">
  <a href="https://arvanj.github.io/airmesh/">Live Demo</a> ·
  <a href="https://arvanj.github.io/airmesh/media/airmesh-launch.mp4">Launch Video</a> ·
  <a href="#modes">Modes</a> ·
  <a href="#portal-filters">Portal Filters</a> ·
  <a href="#how-it-works">How It Works</a>
</p>

---

**Control a holographic workshop with your bare hands.** AirMesh is a browser playground that uses your webcam and computer vision to track both hands in real time. You can open camera-filter portals, sculpt 3D particles, paint in the air, weave neon strings, play a synthesizer and play three mini-games: keep-up, bubble popping and orb slicing.

### ▶ Live: **https://arvanj.github.io/airmesh/**

There is nothing to install. Open the link, allow the camera, and raise your hands. Use desktop Chrome, Edge or Safari with a webcam.

---

## Modes

Switch modes by hovering a fingertip over the bottom bar for about 0.7 seconds, by clicking, or with keys **1–9**.

**Record a clip** in any mode with the **● REC** button in the top-right corner (or press **R**). Press it again to stop, and the video downloads. If the sound is on when you start, it's recorded too.

| # | Mode | What your hands do |
|---|------|--------------------|
| 1 | **Portal** | Make an "L" with your thumb and index finger on **both** hands. The space between them becomes a live camera filter. **Tap thumb + index together** to switch to the next filter (or press **E**). |
| 2 | **Particles 3D** | **Tap thumb + index together** to switch to the next model: torus knot, DNA, galaxy, sphere, heart, **Your hand** (the particles copy your hand live, in 3D) or **You** (your whole silhouette, from person segmentation). With one hand the model **floats above your palm**: it follows your hand, scales with it and tilts with your wrist. With two hands it sits between them: move your right hand to spin it and spread your hands to zoom. Pinch and hold to explode it. |
| 3 | **Air Paint** | Pinch thumb and index to draw glowing strokes. Hold a fist to clear (or press **C**). **K** turns on a kaleidoscope. |
| 4 | **Shapes** | A glowing shape rides your palm. **Pass it hand to hand:** pinch with your empty hand and it flies over in an arc, morphing into the next shape and colour mid-air, then bursts into sparks when you catch it. Spread the thumb and index of the hand holding it to make it bigger, and close them to shrink it. With one hand, 1–5 fingers pick the shape and a pinch sets the brightness. |
| 5 | **Strings** | Your fingertips are strung together with neon light. **Curl a finger to pluck its string.** Longer strings play lower notes, and the string wobbles. Pick a theme: Normal, Cyberpunk, Lava, Ocean or Galaxy (or press **T** to cycle). Click once to turn on sound. |
| 6 | **Synth** | Your left hand's height plays notes on a pentatonic scale. An open hand plays and a fist mutes. Your right hand controls the filter, echo and vibrato (pinch). **Chords:** hold up 1–4 right-hand fingers for power, major, minor or seventh chords; an open hand plays single notes. Five live visualizers read the real audio: **Spectrum**, **Ring**, **Scope**, **Orbit** (an X/Y phase scope, so a sine draws a circle and a square draws a square) and **Sphere** (press **V**). Add a **drum machine** to play over: Four, Hip-hop or Breaks at 110 BPM (press **B**). **Rec loop** (or **L**) records 2 bars of what you play in time with the beat, then loops it under you while you jam. Click once (or press **M**) to turn on audio. |
| 7 | **Keep-up** | A mini-game. Bounce glowing balls off your palms and don't let them drop. Swing up into a ball for a bigger hit. Every 10 hits adds another ball, and your best streak is saved. |
| 8 | **Bubbles** | A mini-game in 45-second rounds. Poke the bubbles floating up with any fingertip. Small ones score more, gold ones are worth 5, and popping quickly builds a combo up to ×5. |
| 9 | **Slice** | A mini-game in 45-second rounds. Glowing orbs are tossed into the air: swipe your index finger fast through them to cut them in half. Cutting several in one swipe earns a bonus. |

### Portal filters
**Heatmap** · **Anime** · Blueprint · Thermal · Matrix · Pop art · X-ray · **Neon edges** · **Cartoon** · **Sketch** · **Emboss** · **Night vision** · **Glitch** · **Cutout** · **Ghost** · **Invisible** · **Echo**

- **Neon edges, Cartoon, Sketch and Emboss** use OpenCV-style image processing: a 3×3 Sobel gradient computed on every frame.
- **Heatmap** paints you hot (yellow to red) against a cool blue room, using a jet colour map plus the segmentation mask.
- **Anime** is a cel-shading look: smoothed colour in three flat light bands, boosted saturation and thin ink lines on strong edges. It runs locally on every frame, so it restyles the camera image rather than redrawing you with AI.
- **Glitch** tears the colour channels sideways in random bands, like a corrupted video signal.
- **Heatmap, Cutout, Ghost, Invisible and Echo** use MediaPipe selfie segmentation to separate you from the background. The mask is grown by 2px with a max filter (like `cv.dilate`) to hide your outline.
  - **Cutout:** puts you in space.
  - **Ghost:** shows you as a heat signature over a blueprint world.
  - **Invisible:** makes you disappear. AirMesh learns the background wherever you *aren't* standing and paints it over you. Any part it has never seen gets filled in from the surroundings (push-pull inpainting, in the spirit of `cv.inpaint`), so you vanish right away and the fill sharpens as you sway side to side.
  - **Echo:** leaves rainbow afterimages behind you as you move.

---

## How it works

- **Hand tracking:** [MediaPipe Tasks Vision](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker) HandLandmarker gives 21 landmarks per hand for 2 hands. It runs in a **Web Worker** (`tracker.js`) so inference never blocks drawing. Results are smoothed toward the newest detection every frame, which keeps motion fluid at 60–120 Hz. Gestures (pinch, finger count, string plucks) are measured on MediaPipe's 3D world landmarks, so they read the same when the camera is off to one side, and a hand that drops out for under 0.2 s is held instead of lost.
- **Segmentation:** MediaPipe ImageSegmenter (selfie model). It runs only while a portal filter that needs it is active (Heatmap, Cutout, Ghost, Invisible, Echo) or the Particles 3D "You" model is showing.
- **Rendering:** a Canvas 2D overlay on the mirrored camera feed. Particles 3D projects its point clouds by hand, with no 3D engine.
- **Audio:** the Web Audio API. Two detuned oscillators and a sub oscillator feed a resonant low-pass filter and a feedback delay. An analyser drives the particle sphere.
- **No build step, no backend:** just `index.html` + `tracker.js`. MediaPipe and its models load from public CDNs.

### Privacy
Everything runs **locally in your browser**. Camera frames are never uploaded anywhere.

## Run it locally

The camera needs `localhost` or HTTPS, so use a local server rather than opening the file directly:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

If you change `tracker.js`, bump the `?v=` number in `new Worker("tracker.js?v=…")` in `index.html`. Otherwise browsers may keep the cached worker for about 10 minutes.

## Credits

- Hand tracking and segmentation: [Google MediaPipe](https://github.com/google-ai-edge/mediapipe) (Apache 2.0)
