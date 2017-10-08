//var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv', {preload: preload, create: create, update: update});


//TODO: refactor everything but the controller into separate files

var game = new Phaser.Game(800,600, Phaser.AUTO, 'gameDiv');



/*** GLOBALS **/

//TODO: defines these in relevant states


var ball;
var paddle;
var bricks;
var numberOfBricksHit = 0;
var bonusScore = 0;
var score = 0;
var lives = 3;
var spaceKey;
var ballOnPaddle = true;
var canvas;
var incomingJson = // or socket data
    {
        numberOfBricks: 15,
        numberOfRows: 4,
    };
var scoreText;
var livesText;
var introText;
var bonusText;
var cursors;
var pKey;
var pauseText;




var level = "1";

var fontObject = {

    font: "16px Stalinist One", fill: "#ffffff", align: "left"
};



/*** STATES **/

const bootState = {
    create: () =>
   {
       game.physics.startSystem(Phaser.Physics.ARCADE); // start physics library
       game.physics.arcade.checkCollision.down = false;
       game.state.start('load');
    }
};


const loadState = {

    preload: () => {
        game.add.text(game.x, game.y, 'loading...', fontObject);
        game.load.atlas('breakout', 'breakout.png', 'breakout.json');
        game.load.atlas('breakout2', 'arkinoid.png', 'breakout2.json');
        game.load.image('space', 'snesbg.png');
        game.load.image('brick0', 'brick0.png');
        game.load.image('brick1', 'brick1.png');
        game.load.image('brick2', 'brick2.png');
        game.load.image('brick3', 'brick3.png');
        game.load.image('brick4', 'brick4.png');
        game.load.image('brick4_2', 'brick4_2.png');
        game.load.image('brick5', 'brick5.png');
        game.load.image('paddle', 'paddle.png');
        game.load.image('ball', 'ball.png');
    },
    create: () =>  {
        game.state.start('levelMenu')
    }
};

var levelMenuState = {
    create: () =>  {
        game.add.text(game.x,game.y, `level: ${level}, press S to start`, fontObject);
        const sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        sKey.onDown.addOnce(levelMenuState.start, this);

    },
    start: () => game.state.start('play')



};


var pauseMenuState = {
    create: () =>
    {
        pauseText.visible = true;
        game.paused = true;
        pKey.onDown.addOnce(pauseMenuState.unpause, this)
    },
    unpause: () => {
        game.paused = false;
        pauseText.visible = false;
    }
};



var playState = {
    create: () =>
    {
        canvas = game.add.tileSprite(0,0, 800,600, 'space');
        createText();
        bindControls();
        makeBricks();
        makePaddle('paddle_big.png'); // from atlas
        makeBall('ball_1.png');


    },
    update: () => {
        if (cursors.left.isDown) {
            paddle.x -= 7;
            if (ballOnPaddle) {
                ball.body.x = paddle.x;
            }
        }
        else if (cursors.right.isDown) {
            paddle.x += 7;
            if (ballOnPaddle) {
                ball.body.x = paddle.x;
            }
        }
        game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this); // null -> callback, this = context
        game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);

    }
};


/*** CONTROLLER **/


game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('levelMenu', levelMenuState);
game.state.add('play', playState);
game.state.add('pause', pauseMenuState);
game.state.start('boot');



/*** GAME LOGIC **/



const releaseBall = () => {
    if (ballOnPaddle) {
        ballOnPaddle = false;
        ball.body.velocity.y = -300;
        ball.body.velocity.x = -75;
        ball.animations.play('spin');
        introText.visible = false;
    }
};


//TODO: bugfix: after losing ball -> still updates old bonusscore a single time....
const ballLost = () => {
    lives--;
    livesText.text = `lives: ${lives}`;
    bonusScore = 0;
    bonusText.text = `bonusscore: ${bonusScore}`;
    numberOfBricksHit = 0;
    if (lives === 0) {
        gameOver();
    }
    else {
        ballOnPaddle = true;
        ball.reset(paddle.body.x + 16, paddle.y - 16); // use paddle body this time instead of world (paddle has different x now)
        ball.animations.stop();
    }
};

const gameOver = () => {
    ball.body.velocity.setTo(0, 0);
    introText.text = 'Game Over!';
    introText.visible = true;
};


const ballHitBrick = (_ball, _brick) => {
    if (_brick.health > 1) {
        _brick.kill();
        _brick = bricks.create(_brick.position.x, _brick.position.y, 'brick4_2', 'brick4_2.png');
        _brick.body.bounce.set(1); // The elasticity of the Body when colliding. bounce.x/y = 1 means full rebound, bounce.x/y = 0.5 means 50% rebound velocity.
        _brick.body.immovable = true; // An immovable Body will not receive any impacts from other bodies.
        _brick.health = 1;
    } else {
        _brick.kill();
    }
    score += 10;
    numberOfBricksHit++;
    scoreText.text = `score ${score}`;
    bonusText.text = `bonusscore: ${bonusScore}`;

    if (numberOfBricksHit > 3) {
        bonusScore += 5;
        score += bonusScore;
    }
    if (bricks.countLiving() === 0) {
        score += 1000;
        scoreText.text = `score: ${score}`;
        introText.text = '- Next lvl -';
        ballOnPaddle = true;
        _ball.body.velocity.set(0);
        _ball.x = paddle.x + 16;
        _ball.y = paddle.y - 16;
        _ball.animations.stop();
        bricks.callAll('revive'); // reset group to original group
    }
};

const ballHitPaddle = (_ball, _paddle) => {
    var difference = 0;
    if (_ball.x < _paddle.x) { // ball is left of paddle

        difference = _paddle.x - _ball.x;
        _ball.body.velocity.x = (-10 * difference);
        console.log("left: " + _ball.body.velocity.x)
    }
    else if (_ball.x > _paddle.x) // ball is right of paddle
    {
        difference = _ball.x - paddle.x;
        _ball.body.velocity.x = (10 * difference);
        console.log("right: " + _ball.body.velocity.x)
    }
    else { // ball in exact middle --> random x to prevent bouncing straight up
        _ball.body.velocity.x = 2 + Math.random() * 8;
        console.log("dead center: " + _ball.body.velocity.x)
    }
};


/*** GAME SETUP ***/

//TODO: figure out how we are getting the data and refactor
const makeBricks = () => {
    bricks = game.add.group(); // phaser lets you group objects - docs for extra methods
    bricks.enableBody = true; // enables a body to allow collision
    bricks.physicsBodyType = Phaser.Physics.ARCADE; // does the same for groups as game.physics.enable

    for (var y = 0; y < incomingJson.numberOfRows; y++) {
        for (var x = 0; x < incomingJson.numberOfBricks; x++) {
            var sort = Math.floor((Math.random() * 5) + 0);
            brick = bricks.create(120 + (x * 36), 100 + (y * 52), 'brick' + sort, 'brick' + sort + '.png');  // x - y - png
            // var sort = 5;
            brick.body.bounce.set(1); // The elasticity of the Body when colliding. bounce.x/y = 1 means full rebound, bounce.x/y = 0.5 means 50% rebound velocity.
            brick.body.immovable = true; // An immovable Body will not receive any impacts from other bodies.
            if (sort == 4) {
                brick.health = 2;
            }
        }
    }
};


const makePaddle = (sprite) => {
    paddle = game.add.sprite(game.world.centerX, 500, 'breakout2', 'paddle_ark.png');// add sprite on x and y
    paddle.anchor.setTo(0.5,0.5); // set position of the texture relative to xy ----> centers texture to object http://www.goodboydigital.com/pixijs/docs/classes/Sprite.html#property_pivot
    game.physics.enable(paddle, Phaser.Physics.ARCADE); // enables the physics onto the paddle
    paddle.body.collideWorldBounds = true;
    paddle.body.bounce.set(1);
    paddle.body.immovable = true;
};


const makeBall = (sprite) => {
    ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'ball', "ball.png"); // TO DO
    ball.anchor.setTo(0.5, 0.5);
    ball.checkWorldBounds = true; // https://phaser.io/docs/2.3.0/Phaser.Component.InWorld.html
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.collideWorldBounds = true;
    ball.body.isCircle = true;
    ball.body.setCircle();
    ball.body.bounce.set(1);
    ball.animations.add('spin', ['ball.png', 'ball.png', 'ball.png', 'ball.png', 'ball.png'], 50, true, false) // we can call this with .play later
    ball.events.onOutOfBounds.add(ballLost, this); // ball drops below bottom -  triggers onOutOfBounds --> reset it
};

//TODO refactor into different states, add text content and location as parameters
const createText = () => {
    scoreText = game.add.text(32, 550, 'score: 0', fontObject);
    livesText = game.add.text(680, 550, 'lives: 3', fontObject);
    bonusText = game.add.text(400, 550, 'bonusscore: 0', fontObject);
    introText = game.add.text(game.world.centerX, 400, '- press SPACE to start -', fontObject.align = "center");
    introText.anchor.setTo(0.5, 0.5);
    pauseText = game.add.text(game.x,game.y, `press P to continue`, fontObject);
    pauseText.visible = false;
};

const bindControls = () => {
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(releaseBall, this);
    cursors = game.input.keyboard.createCursorKeys();
    pKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
    pKey.onDown.add(pauseMenuState.create, this);
};










