'use strict';

/****************************************************************************
 * Initial setup
 ****************************************************************************/

var video = document.querySelector('video');
var photoContainer = $("#photo_container");
var photoData;
var PHOTO_INTERVAL = 250;
var PHOTO_COUNT = 16;
var image_array = [];
var count = 0;
var photoContextW = 64;
var photoContextH = 64;
var intervalHandler;

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
 * Cookie and Session Cookie Functions
 ****************************************************************************/

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

function getSessionCookie() {
    var sessionCookie = getCookie("sessionCookie");
    if (sessionCookie == "") {
        sessionCookie = Math.random().toString(36);
        window.document.cookie = "sessionCookie=" + sessionCookie + "; expires=0; path=/";
    }
    return sessionCookie;
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
    }
}

function applyImageFilter(context) {
    var start_time = performance.now();
    var imgPixels = context.getImageData(0, 0, photoContextW, photoContextH);
    for (var y = 0; y < imgPixels.height; y++) {
        for (var x = 0; x < imgPixels.width; x++) {
            var i = (y * 4) * imgPixels.width + x * 4;

            var r = imgPixels.data[i];
            var g = imgPixels.data[i + 1];
            var b = imgPixels.data[i + 2];

            if (!isRed(r, g, b)) {
                var avg = (r + g + b) / 3;
                imgPixels.data[i] = imgPixels.data[i + 1] = imgPixels.data[i + 2] = avg;
            }
        }
    }
    context.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);

    var end_time = performance.now();

    // console.log(end_time - start_time);
}

function isRed(r, g, b) {
    return r > 100 && g < 100 && b < 100;
}


/****************************************************************************
 * Aux functions, mostly UI-related
 ****************************************************************************/

function show() {
    Array.prototype.forEach.call(arguments, function (elem) {
        elem.style.display = null;
    });
}

function hide() {
    Array.prototype.forEach.call(arguments, function (elem) {
        elem.style.display = 'none';
    });
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
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
        var post_data = {
            data: image_array,
            uid: getSessionCookie(),
            class: $("#classification").val()
        };
        console.log(post_data);
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


})
;
