/*var videoElement = document.getElementById("webcam-mirror");

if(navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
        .then(function(stream){
            videoElement.srcObject = stream;
        })
        .catch(function(err){
            console.log("Something went wrong!");
            console.dir(err);
        });
}*/
const WIDTH = 400;
const HEIGHT = 400;
var canvas = document.getElementById("face-canvas");
let faceapi;
let ctx;
let video;

window.addEventListener("DOMContentLoaded", async function() {
    await main();
});

async function main() {
    try {
        video = await getVideo();
        ctx = getCanvasContext();
        faceapi = ml5.faceApi(video, { withLandmarks: true, withDescriptors: false }, modelReady);
    } catch(err) {
        alert(err);
    }
}

async function getVideo() {
    if(!navigator.mediaDevices.getUserMedia) throw ("Need to access your webcam to run face analysis");
    const webcamStream = await navigator.mediaDevices.getUserMedia({video: true});

    const videoElement = document.getElementById("webcam-vid");
    videoElement.width = WIDTH;
    videoElement.height = HEIGHT;
    videoElement.srcObject = webcamStream;
    return videoElement;
}

function getCanvasContext() {
    const canvas = document.getElementById("face-canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    return canvas.getContext("2d");
}

function handleResults(err, detections) {
    if(err) throw err;
    else drawDetectionsInCanvas(detections);
}

function modelReady() {
    console.log("The faceapi model is loaded");
    faceapi.detect(handleResults);
}

function drawDetectionsInCanvas(detections) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);
    if (detections) {
        if (detections.length > 0) {
          drawBox(detections);
          drawLandmarks(detections);
        }
    }
    faceapi.detect(handleResults);
}

function drawBox(detections) {
    for (let i = 0; i < detections.length; i += 1) {
      const alignedRect = detections[i].alignedRect;
      const x = alignedRect._box._x;
      const y = alignedRect._box._y;
      const boxWidth = alignedRect._box._width;
      const boxHeight = alignedRect._box._height;
  
      ctx.beginPath();
      ctx.rect(x, y, boxWidth, boxHeight);
      ctx.strokeStyle = "#a15ffb";
      ctx.stroke();
      ctx.closePath();
    }
  }
  
  function drawLandmarks(detections) {
    for (let i = 0; i < detections.length; i += 1) {
      const mouth = detections[i].parts.mouth;
      const nose = detections[i].parts.nose;
      const leftEye = detections[i].parts.leftEye;
      const rightEye = detections[i].parts.rightEye;
      const rightEyeBrow = detections[i].parts.rightEyeBrow;
      const leftEyeBrow = detections[i].parts.leftEyeBrow;
  
      drawPart(mouth, true);
      drawPart(nose, false);
      drawPart(leftEye, true);
      drawPart(leftEyeBrow, false);
      drawPart(rightEye, true);
      drawPart(rightEyeBrow, false);
    }
  }
  
  function drawPart(feature, closed) {
    ctx.beginPath();
    for (let i = 0; i < feature.length; i += 1) {
      const x = feature[i]._x;
      const y = feature[i]._y;
  
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
  
    if (closed === true) {
      ctx.closePath();
    }
    ctx.stroke();
  }