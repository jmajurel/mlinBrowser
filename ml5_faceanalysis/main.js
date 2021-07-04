const WIDTH = 800;
const HEIGHT = 800;
var canvas = document.getElementById("face-canvas");
let facemesh;
let ctx;
let video;

window.addEventListener("DOMContentLoaded", async function() {
    await main();
});


async function main() {
    try {
        video = await getVideo();
        ctx = getCanvasContext();
        facemesh = ml5.facemesh(video, modelReady);

        function modelReady() {
            console.log("The faceapi model is loaded");
        }
        
        facemesh.on('predict', results => {
            predictions = results;
            drawDetectionsInCanvas(predictions);
        });

        
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
            const ctx = canvas.getContext("2d");
            /*ctx.scale(1.5, 1.5);
            ctx.translate(-WIDTH*0.1, -HEIGHT*0.1)*/
            return ctx;
        }

        function drawDetectionsInCanvas(detections) {
            ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);
            if (detections && detections.length > 0) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
                drawKeypoints(predictions);
            }
        }
        window.requestAnimationFrame(drawDetectionsInCanvas);
        
        // A function to draw ellipses over the detected keypoints
        function drawKeypoints(predictions) {
            for (let i = 0; i < predictions.length; i += 1) {
                const keypoints = predictions[i].scaledMesh;
        
                // Draw facial keypoints.
                for (let j = 0; j < keypoints.length; j += 1) {
                    const [x, y] = keypoints[j];
                    ctx.beginPath();
                    ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "purple";
                    ctx.stroke();
                }
            }
        }

        
    } catch(err) {
        alert(err);
    }
}

