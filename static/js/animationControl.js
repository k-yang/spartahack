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
    },3000)
}

// shows map and arrow, hide the rest
var showMap = function(){
    hideId('#action3');
    $('#face-icon').addClass('hidden');
    showHidden('#head-overlay');
    $('#head-overlay').addClass('map-bg')
    showHidden('#action4');
    showHidden('#arrow');
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