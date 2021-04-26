importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd');
tf.setBackend('webgl');

let model = null;

const setup = async () => {
  model = await cocoSsd.load({base: 'lite_mobilenet_v2',});
  postMessage({modelIsReady: true});
}

setup();

onmessage = evt => {
  if (model!=null) {
    predict(evt.data);
  }
}

const predict = async function(image) {
  const result = await model.detect(image);
  const boxes = result.map(boxInfo => [
    boxInfo.bbox[0],
    boxInfo.bbox[1],
    boxInfo.bbox[0] + boxInfo.bbox[2],
    boxInfo.bbox[1] + boxInfo.bbox[3],
  ]);
  const scores = result.map(boxInfo => boxInfo.score);
  const classes = result.map(boxInfo => boxInfo.class);
  console.log('Worker:',result)
  postMessage(result);
 }