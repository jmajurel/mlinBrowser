const WIDTH =  640;
const HEIGHT = 480;
if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) alert("this page needs webcame access");

async function main() {
    const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let poses = [];

    const video = document.getElementById("webcam-vid");
    video.srcObject = videoStream;

    const poseNet = ml5.poseNet(video, () => {
        alert("model has been successfully loaded"); 
        poseNet.multiPose(video);
    });

    poseNet.on('pose', results => {
        poses = results;
        
    });
    drawCameraIntoCanvas();

    function drawCameraIntoCanvas() {
        // Draw the video element into the canvas
        ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);
        // We can call both functions to draw all keypoints and the skeletons
        drawKeypoints();
        drawSkeleton();
        window.requestAnimationFrame(drawCameraIntoCanvas);
      }

    // A function to draw ellipses over the detected keypoints
    function drawKeypoints() {
        // Loop through all the poses detected
        for (let i = 0; i < poses.length; i += 1) {
            // For each pose detected, loop through all the keypoints
            for (let j = 0; j < poses[i].pose.keypoints.length; j += 1) {
            let keypoint = poses[i].pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.2) {
                ctx.beginPath();
                ctx.strokeStyle = "purple";
                ctx.lineWidth = 2;
                ctx.arc(keypoint.position.x, keypoint.position.y, 10, 0, 2 * Math.PI);
                ctx.stroke();
            }
            }
        }
    }

    // A function to draw the skeletons
    function drawSkeleton() {
        // Loop through all the skeletons detected
        for (let i = 0; i < poses.length; i += 1) {
            // For every skeleton, loop through all body connections
            for (let j = 0; j < poses[i].skeleton.length; j += 1) {
            let partA = poses[i].skeleton[j][0];
            let partB = poses[i].skeleton[j][1];
            ctx.beginPath();
            ctx.strokeStyle = "purple";
            ctx.lineWidth = 5;
            ctx.moveTo(partA.position.x, partA.position.y);
            ctx.lineTo(partB.position.x, partB.position.y);
            ctx.stroke();
            }
        }
    }

}

main();