// https://forum.babylonjs.com/t/efficient-web-worker-data-transfer-strategies/34994
// allegedly "accessing event.data in onmessage() is stealing time from the main thread."

let liftedEvent: MessageEvent<ArrayBufferLike>

function readEvent(e: MessageEvent<ArrayBufferLike>) {
  liftedEvent = e;

  setTimeout(boundPost, 0);
}

/** used so we don't create new functions every frame */
function boundPost() {
  postMessage(liftedEvent.data, [liftedEvent.data]);
}


self.onmessage = (e: MessageEvent<ArrayBufferLike>) => {
  readEvent(e);
};
