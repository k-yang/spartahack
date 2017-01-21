'use strict';

/****************************************************************************
 * Initial setup
 ****************************************************************************/

// var roomURL = document.getElementById('url');
var video = document.querySelector('video');
var photo = document.getElementById('photo');
var photoContext = photo.getContext('2d');
var photoData;
var PHOTO_INTERVAL = 250;

var photoContextW;
var photoContextH;

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
    video.onloadedmetadata = function () {
        photo.width = photoContextW = 120;
        photo.height = photoContextH = 90;
        console.log('gotStream with with and height:', photoContextW, photoContextH);
    };
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
    photoContext.drawImage(video, 0, 0, photo.width, photo.height);
    photoData = photo.toDataURL().substring(22);
    var data = {
        image: photoData,
        user_id: getSessionCookie()
    };
    console.log(data);

    applyImageFilter();

    // var jsonData = JSON.stringify(data);
    // $.ajax({
    //     type: "POST",
    //     url: "/collect",
    //     headers: {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
    //     data: jsonData,
    //     crossDomain: true,
    //     dataType: "json"
    // })
    //     .done(function (msg) {
    //         console.log(msg);
    //     });
}

function applyImageFilter() {
    var imgPixels = photoContext.getImageData(0, 0, photoContextW, photoContextH);
    for(var y = 0; y < imgPixels.height; y++) {
        for(var x = 0; x < imgPixels.width; x++) {
            var i = (y * 4) * imgPixels.width + x * 4;

            var r = imgPixels.data[i];
            var g = imgPixels.data[i+1];
            var b = imgPixels.data[i+2];

            if (!isRed(r,g,b)) {
                var avg = (r+g+b) / 3;
                imgPixels.data[i] = imgPixels.data[i + 1] = imgPixels.data[i + 2] = avg;
            }
        }
    }
    photoContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
}

function isRed(r, g, b) {
    return r > 110 && g < 100 && b < 100;
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

/****************************************************************************
 * Init
 ****************************************************************************/

initWebCam();

$("#snap").click(function () {
    savePhoto();
});
