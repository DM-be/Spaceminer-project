//var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv', {preload: preload, create: create, update: update});




var game = new Phaser.Game(800,600, Phaser.AUTO, 'gameDiv');



/*** GLOBALS **/

//TODO: what are we going to do with globals?


var scoreText;
var livesText;
var introText;
var bonusText;
var cursors;
var pKey;
var pauseText;

var paddle;

var numberOfBricksHit = 0;
var bonusScore = 0;
var score = 0;
var lives = 3;
var spaceKey;
var ballOnPaddle;
var canvas;
var incomingJson = // or socket data
    {
        numberOfBricks: 15,
        numberOfRows: 4,
    };

var level = "1";

var fontObject = {

    font: "16px Stalinist One", fill: "#ffffff", align: "left"
};


const main = { // main entry -> loads assets for loading screen -> loading screen loads everything else
    preload: function() {

        game.load.image('loading', 'loading.png');
        game.load.image('starfield', 'starfield.jpg');
        game.load.image('stars', 'stars.jpg');
        game.load.image('logo', 'logo.png');
        game.load.script('utils', '/helpers/utils.js');
        game.load.script('splash', '/states/splash.js');
    },
    create: function()
   {
       game.physics.startSystem(Phaser.Physics.ARCADE); // start physics library
       game.physics.arcade.checkCollision.down = false;
       game.state.add('Splash', splash);
       game.state.start('Splash');
    }
};

game.state.add('Main', main);
game.state.start('Main');
















