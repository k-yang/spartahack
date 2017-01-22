'use strict';

/****************************************************************************
 * Initial setup
 ****************************************************************************/

var video = document.querySelector('video');
var photo = document.getElementById('photo');
var photoContext = photo.getContext('2d');
var photoData;
var PHOTO_INTERVAL = 100;
var PHOTO_COUNT = 16;
var intervalHandler;
var count = 0;
var image_array = [];

var photoContextW = 64;
var photoContextH = 64;

/****************************************************************************
 * User media (webcam)
 ****************************************************************************/

function initWebCam() {
    console.log('Getting user media (video) ...');
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    })
        .then(gotStream)
        .catch(function (e) {
            console.log('getUserMedia() error: ' + e.name);
        });
}

function gotStream(stream) {
    var streamURL = window.URL.createObjectURL(stream);
    console.log('getUserMedia video stream URL:', streamURL);
    window.stream = stream; // stream available to console
    video.src = streamURL;
}


/****************************************************************************
 * Photo Functions
 ****************************************************************************/

function savePhoto() {
    photoContext.drawImage(video, 60, 0, 480, 480, 0, 0, photo.width, photo.height);
    applyImageFilter(photoContext);
    photoData = photo.toDataURL().substring(22);
    image_array.push(photoData);

    count += 1;
    if (count >= PHOTO_COUNT) {
        clearInterval(intervalHandler);
    }
}

/****************************************************************************
 * Init
 ****************************************************************************/

initWebCam();

/****************************************************************************
 * Event Handlers
 ****************************************************************************/

$("#snap").click(function () {
    image_array = [];
    count = 0;
    intervalHandler = setInterval(savePhoto, PHOTO_INTERVAL);

    setTimeout(function () {
        var data = {
            data: image_array,
            uid: getSessionCookie(),
            frame: count
        };
        var jsonData = JSON.stringify(data);
        console.log(data);
        $.ajax({
            type: "POST",
            url: "/convert",
            headers: {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
            data: jsonData,
            crossDomain: true,
            dataType: "json"
        })
            .done(function (msg) {
                console.log(msg);
            });

    }, PHOTO_INTERVAL * PHOTO_COUNT)
});
