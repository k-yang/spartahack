'use strict';

/****************************************************************************
 * Initial setup
 ****************************************************************************/

// var roomURL = document.getElementById('url');
var video = document.querySelector('video');
var photo = document.getElementById('photo');
var photoContext = photo.getContext('2d');
var webcamSwitchRadio = document.getElementById("webcam-switch-radio");
var photoData;
var photoTimer;
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
        photo.width = photoContextW = 640;
        photo.height = photoContextH = 480;
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
    var sessionCookie = getCookie("scoutSessionCookie");
    if (sessionCookie == "") {
        sessionCookie = Math.random().toString(36);
        window.document.cookie = "scoutSessionCookie=" + sessionCookie + "; expires=0; path=/";
    }
    return sessionCookie;
}

/****************************************************************************
 * Photo Functions
 ****************************************************************************/

function savePhoto() {
    if (webcamSwitchRadio.checked) {
        photoContext.drawImage(video, 0, 0, photo.width, photo.height);
        photoData = photo.toDataURL().substring(22);
        var data = {
            image: photoData,
            user_id: getSessionCookie(),
            video_id: VIDEO_ID,
            timestamp: Math.round(player.getCurrentTime() * 2)
        };
        console.log(data);
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

webcamSwitchRadio.addEventListener("click", function () {
    console.log(webcamSwitchRadio.checked);
    if (webcamSwitchRadio.checked) {
        initWebCam();
    } else {
        window.stream.getTracks()[0].stop();
    }
});


$("#snap").click(function(){
    savePhoto();
});
