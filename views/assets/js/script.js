/**
 * Created by Mathias Standaert on 7/10/2017.
 */
var singleplayer = function (e) {
    e.preventDefault();
    $('#mainMenu').addClass("hidden");
    $('#levelpicker').removeClass("hidden");
    $('video').prop('muted', true);
};
var startGame = function (e) {
    e.preventDefault();
    $('#levelpicker').addClass("hidden");
    $('#game').removeClass("hidden");
}
$(document).ready(function () {
    $('#singleplayer').on('click',singleplayer);
    $('.levelx.active').on('click',startGame);
});