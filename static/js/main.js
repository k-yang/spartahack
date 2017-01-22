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
 * Image Filtering Functions
 ****************************************************************************/

function applyImageFilter(context) {
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
}


function isRed(r, g, b) {
    return r > 110 && g < 100 && b < 100;
}
var wakeAlexa = function(){
    var audio = new Audio('/static/audio/alexalaunchhelp.mp3');
    setTimeout(audio.play(),2000);
}

var showFailure = function(){
    var reply = 'Sorry, I couldn\'t understand that...\ntry again!'.toUpperCase();
    $('#action4').text(reply);
    $('#action4').removeClass('hidden');
    $('#action1').addClass('hidden');
    $('#action2').addClass('hidden');
    $('#action3').addClass('hidden');
    $('#face-icon').addClass('hidden');
    $('#error').removeClass('hidden')
    $('#head-overlay').removeClass('hidden')
    $('#bubble').removeClass('hidden')
    setTimeout(function(){
        resetAll();
    },5000)
}
