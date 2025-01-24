// https://forum.babylonjs.com/t/efficient-web-worker-data-transfer-strategies/34994
// allegedly "accessing event.data in onmessage() is stealing time from the main thread."

function readEvent(e: MessageEvent<ArrayBufferLike>) {
  setTimeout(() => {
    postMessage(e.data, [e.data]);
  }, 0);
}

self.onmessage = (e: MessageEvent<ArrayBufferLike>) => {
  readEvent(e);
};
