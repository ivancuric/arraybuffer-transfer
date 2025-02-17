// https://forum.babylonjs.com/t/efficient-web-worker-data-transfer-strategies/34994
// allegedly "accessing event.data in onmessage() is stealing time from the main thread."

import "./style.css";
import { FPS } from "yy-fps";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Vite + Worker</h1>
    <div class="card">
      <button id="ping">Start</button>
      <p id="response"></p>
    </div>
  </div>
`;

const fps = new FPS({
  FPS: 50000,
});

const worker = new Worker(new URL("./worker.ts", import.meta.url));

const button = document.querySelector<HTMLButtonElement>("#ping")!;

let pixels = new Uint8Array(4096 * 2160 * 4);
let buffer = pixels.buffer;
let busy = false;
let pause = true;

function post() {
  busy = true;
  worker.postMessage(buffer, [buffer]);
  fps.frame();
}

function loop() {
  if (busy) {
    return;
  }

  if (pause) {
    return;
  }

  setTimeout(post, 0);
}

worker.onmessage = (e: MessageEvent) => {
  readEvent(e);
  busy = false;
  loop();
};

function readEvent(e: MessageEvent<ArrayBuffer>) {
  buffer = e.data;
  pixels = new Uint8Array(buffer);
}

button.addEventListener("click", () => {
  pause = !pause;
  button.textContent = pause ? "start" : "stop";

  if (!pause) {
    loop();
  } else {
    return;
  }
});
