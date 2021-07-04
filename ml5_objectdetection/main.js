
const WIDTH = 800;
const HEIGHT = 800;


window.addEventListener("DOMContentLoaded", async function() {
    const videoElm = document.getElementById("video");
    const canvas = document.getElementById("obj-canvas");
    const ctx = canvas.getContext('2d');
    ctx.scale(0.4, 0.4)
    const objectDetector = ml5.objectDetector('cocossd', {}, ()=> alert("obj detection model has been successfully loaded"));

   
    videoElm.addEventListener('play', () => {
       function step() {
            ctx.drawImage(videoElm, 0, 0, videoElm.videoWidth, videoElm.videoHeight)
            objectDetector.detect(videoElm, (err, predictions) => {
                if (predictions && predictions.length > 0) {
                    ctx.fillStyle = "transparent";
                    ctx.fillRect(0, 0, WIDTH, HEIGHT);
                    predictions.forEach(prediction => drawBox(ctx, prediction));
                }
            });
         requestAnimationFrame(step)
       }
       requestAnimationFrame(step);
    })

    function drawBox(ctx, prediction){
        ctx.beginPath();
        ctx.rect(prediction.x, prediction.y, prediction.width, prediction.height);
        ctx.strokeStyle = "purple";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.closePath();
    }
});
