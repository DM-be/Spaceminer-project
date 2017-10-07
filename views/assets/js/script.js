/**
 * Created by Mathias Standaert on 7/10/2017.
 */
var singleplayer = function (e) {
    e.preventDefault();
    $('#mainMenu').addClass("hidden");
    $('#game').removeClass("hidden");
    $('video').prop('muted', true);
};
$(document).ready(function () {
    $('#singleplayer').on('click',singleplayer)
});