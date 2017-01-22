'use strict';

/****************************************************************************
 * Initial setup
 ****************************************************************************/

var video = document.querySelector('video');
var photoContainer = $("#photo_container");
var photoData;
var PHOTO_INTERVAL = 100;
var PHOTO_COUNT = 100;
var image_array = [];
var count = 0;
var photoContextW = 64;
var photoContextH = 64;
var intervalHandler;
var clock;

for (var i = 0; i < PHOTO_COUNT; i++) {
    photoContainer.append("<canvas width='64' height='64' class='photo_frame' id='photo_frame_" + i + "'></canvas>");
}
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
    var photo = document.getElementById("photo_frame_" + count);
    if (!photo) {
        return;
    }
    var photoContext = photo.getContext('2d');
    photoContext.drawImage(video, 60, 0, 480, 480, 0, 0, photo.width, photo.height);
    applyImageFilter(photoContext);
    photoData = photo.toDataURL().substring(22);
    image_array.push(photoData);
    count += 1;
    if (count >= PHOTO_COUNT) {
        clearInterval(intervalHandler);
        alert("Done capturing");
    }
}


function beginCaptureSequence() {
    image_array = [];
    count = 0;

    intervalHandler = setInterval(savePhoto, PHOTO_INTERVAL);

    setTimeout(function () {
        var post_data = {
            data: image_array,
            uid: getSessionCookie(),
            class: $("#classification").val()
        };
        var jsonData = JSON.stringify(post_data);
        $.ajax({
            type: "POST",
            url: "/batch_save",
            headers: {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
            data: jsonData,
            crossDomain: true,
            dataType: "json"
        })
            .done(function (msg) {
                console.log(msg);
            });
    }, PHOTO_INTERVAL * PHOTO_COUNT);
}


/****************************************************************************
 * Init
 ****************************************************************************/

initWebCam();

/****************************************************************************
 * Event Handlers
 ****************************************************************************/
$("#snap").click(function () {
    beginCaptureSequence();
});


/****************************************************************************
 * Timer
 ****************************************************************************/

$(document).ready(function () {
    clock = $('.timer').FlipClock({});
});