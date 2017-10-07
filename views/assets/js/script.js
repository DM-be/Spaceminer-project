/**
 * Created by Mathias Standaert on 7/10/2017.
 */
var paused = true;
var singleplayer = function (e) {
    e.preventDefault();
    soundClick();
    $('#mainMenu').addClass("hidden");
    $('#levelpicker').removeClass("hidden");
    $('video').prop('muted', true);
};
var startGame = function (e) {
    e.preventDefault();
    soundClick();
    $('#levelpicker').addClass("hidden");
    $('#game').removeClass("hidden");
};
var soundClick = function () {
    new Audio("/views/assets/images/Cursor.wav").play();
};
$(document).ready(function () {
    $('#singleplayer').on('click',singleplayer);
    $('.levelx.active').on('click',startGame);

    $("body").keypress(function (e) {
        var  key = window.event.keyCode;;
        if(key === 109){
            if(paused){
                $('audio')[0].play();
                paused = false;
            }else{
                $('audio')[0].pause();
                paused = true;
            }
        }
    });
});