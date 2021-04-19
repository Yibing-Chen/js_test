let canvasFrame = document.getElementById("canvasFrame"); // canvasFrame is the id of <canvas>
let context = canvasFrame.getContext("2d");
let src = new cv.Mat(height, width, cv.CV_8UC4);
let dst = new cv.Mat(height, width, cv.CV_8UC1);
const FPS = 30;
function processVideo() {
    let begin = Date.now();
    context.drawImage(video, 0, 0, width, height);
    src.data.set(context.getImageData(0, 0, width, height).data);
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.imshow("canvasOutput", dst); // canvasOutput is the id of another <canvas>;
    // schedule next one.
    let delay = 1000/FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
}
// schedule first one.
setTimeout(processVideo, 0);




const videoSrc = document.getElementById('video-src');
const canvas0 = document.getElementById('canvas0');
const ctx = canvas0.getContext('2d');

function onOpenCvReady() {
    cv['onRuntimeInitialized']=()=>{
        console.log("OPENCVJS LOADED!");
        alert('OpenCV.js is ready.');
        // do all your work here
    };
}



function startVideo(){
    if (navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia){
        // define a Promise that'll be used to load the webcam and read its frames
        const webcamPromise = navigator.mediaDevices
            .getUserMedia({
                //video: {
                //  width: { ideal: 320 },
                //  height: { ideal: 240 },
                //  frameRate: { ideal: 10 },
                //},
                video: true,
                audio: false,
            })
            .then(stream => {
                // pass the current frame to the window.stream
                window.stream = stream;
                // pass the stream to the videoRef
                videoSrc.srcObject = stream;

                return new Promise(resolve => {
                    videoSrc.onloadedmetadata = () => {
                        resolve();
                    };
                });
            }, (error) => {
            console.log("Couldn't start the webcam")
            console.error(error)
        });
    }
}

function undistort(){
    // Draw the video frame to the canvas.
    ctx.drawImage(videoSrc, 0, 0, canvas0.width, canvas0.height);
    let src = cv.imread('canvas0');
    let dst = new cv.Mat();
    let fisheyeK = cv.matFromArray(3, 3, cv.CV_32FC1, 
                                   [1.59064e+03,   0.00000e+00,   1.91950e+03,
                                    0.00000e+00,   1.58753e+03,   1.07950e+03,
                                    0.00000e+00,   0.00000e+00,   1.00000e+00]);
    let fisheyeD = cv.matFromArray(4, 1, cv.CV_32FC1, 
                                   [-1.09917e-01, 4.63744e-02, -3.09370e-02, 7.79134e-03]);
    cv.imshow('canvas1', dst);
    src.delete();
    dst.delete();
}

startVideo();
onOpenCvReady();