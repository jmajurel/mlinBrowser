var videoElement = document.getElementById("webcam-mirror");

if(navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
        .then(function(stream){
            videoElement.srcObject = stream;
        })
        .catch(function(err){
            console.log("Something went wrong!");
            console.dir(err);
        });
}