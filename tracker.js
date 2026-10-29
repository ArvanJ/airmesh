// Hand tracking off the main thread, so inference never stalls rendering.
// Classic (not module) worker: MediaPipe's wasm loader relies on importScripts.
const BUNDLE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.cjs";
let FilesetResolver, HandLandmarker;
async function loadBundle() { // CDN serves .cjs with a non-JS MIME type, so re-wrap it as a JS blob for importScripts
  const code = await (await fetch(BUNDLE)).text();
  self.module = { exports: {} }; self.exports = self.module.exports; // let the CommonJS bundle export into module.exports
  importScripts(URL.createObjectURL(new Blob([code], { type: "text/javascript" })));
  ({ FilesetResolver, HandLandmarker } = self.module.exports);
}

const MODELS = "https://storage.googleapis.com/mediapipe-models/";
let hand;

async function create(Cls, fileset, modelAssetPath, opts) {
  try { return await Cls.createFromOptions(fileset, { baseOptions: { modelAssetPath, delegate: "GPU" }, runningMode: "VIDEO", ...opts }); }
  catch { return Cls.createFromOptions(fileset, { baseOptions: { modelAssetPath, delegate: "CPU" }, runningMode: "VIDEO", ...opts }); } // no WebGL in workers on some browsers
}

onmessage = async ({ data }) => {
  try {
    if (data.type === "init") {
      await loadBundle();
      const fileset = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");
      hand = await create(HandLandmarker, fileset, MODELS + "hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task", { numHands: 2 });
      // first inference compiles GPU shaders (seconds): do it now, not on the user's first gesture
      const warm = new OffscreenCanvas(64, 64); warm.getContext("2d").fillRect(0, 0, 64, 64);
      hand.detectForVideo(warm, 0);
      postMessage({ type: "ready" });
    } else if (data.type === "frame") {
      const { bitmap, t } = data;
      const hands = hand.detectForVideo(bitmap, t).landmarks;
      bitmap.close();
      postMessage({ type: "result", hands });
    }
  } catch (e) {
    data.bitmap?.close();
    postMessage({ type: "error", message: e.message });
  }
};
