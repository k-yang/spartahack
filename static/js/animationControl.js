var hideId = function(id){
    $(id).addClass('hidden')
}
var showHidden = function(id){
    $(id).removeClass('hidden')
}

// Triggers action1 - hides overlay and CTA
var action1 = function(){
    hideId('#head-overlay');
    hideId('#action1');
    showHidden('#action2');
    setTimeout(function(){
        hideId('#action2');
        showHidden('#action3');
        setTimeout(startGesture,2000)
    },3000)
}

// shows map and arrow, hide the rest
var showMap = function(room){
    hideId('#action3');
    $('#face-icon').addClass('hidden');
    showHidden('#head-overlay');
    $('#head-overlay').addClass('map-bg')
    showHidden('#action4');
    showHidden('#arrow');
    positionPointer(room);
    displayIntent();
}

// on key Z press trigger action1
document.onkeypress = function (e) {
    if (e.keyCode == 122){
        action1();
    }
}

//moves the pointer to the correct location
var positionPointer = function(pointer){
    $('#arrow').addClass(pointer)
}

var displayIntent = function(intent,location){
    console.log(intent);
    reply = '';
    if(intent=="help"){
        reply = 'A moment please! One of our staff members is on their way.'
    } else {
        reply = 'The ' + intent + 'can be found in room' + location + '!'
    }
    $('#action4').text(reply)
}

var resetAll = function(){
    showHidden('#head-overlay');
    showHidden('#action1');
    hideId('#action2');
    hideId('#action3');
    hideId('#action4');
    $('#head-overlay').removeClass('map-bg');
    $('#arrow').removeClass();
    hideId('#arrow');
}
