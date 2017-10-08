/**
 * Created by Mathias Standaert on 7/10/2017.
 */
var paused = true;
var singleplayer = function () {
    soundClick();
    $('#mainMenu').addClass("hidden");
    $('#levelpicker').removeClass("hidden");
    $('video').prop('muted', true);
};
var startGame = function() {
    $("#firstcutscene").addClass("hidden");
    $('#game').removeClass("hidden");
};
var soundClick = function () {
    new Audio("/views/assets/images/Cursor.wav").play();
    console.log("play")
};
var firstCutscene = function () {
    soundClick();
    $('#levelpicker').addClass("hidden");
    $("#firstcutscene").removeClass("hidden");
    $('#text').typeIt({
        strings: ["Welcome soldier, You have been recruited for a very special mission.",
            "Scientists have discovered a planet, XFW 73D, that is made completely out of diamonds. We named the planet \"Diamonds Cloud\".",
            "To reach the planet, we need to build a spaceship capable of making the long journey and that is where we need your help.",
            "Your mission is to obtain the building materials for this ship on planets in nearby galaxies.",
            "BEWARE, rumours of \"Diamonds Cloud\" are spreading to other civilizations so be careful!"],
        speed: 50,
        autoStart: true
    });

    //startGame;
};
$(document).ready(function () {
    $('#singleplayer').on('click', singleplayer);
    $('.levelx.active').on('click', firstCutscene);

    $("body").keypress(function (e) {
        var key = window.event.keyCode;
        ;
        if (key === 109) {
            if (paused) {
                $('audio')[0].play();
                paused = false;
            } else {
                $('audio')[0].pause();
                paused = true;
            }
        } else if (key === 13 && !$('#firstcutscene').hasClass("hidden")) {
            startGame();

        }
    });
});