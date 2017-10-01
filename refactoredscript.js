var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update });



function preload() {

    game.load.atlas('breakout', 'breakout.png', 'breakout.json');
    game.load.image('space', 'space.gif');
}

var ball;
var paddle;
var bricks;
var score =0;
var lives = 3;

var spaceKey;

var ballOnPaddle = true;

var canvas; //

var incomingJson = // or socket data
    {
        numberOfBricks: 15,
        numberOfRows: 4,
    };

var scoreText;
var livesText;
var introText;
var cursors;



function create() {


    game.physics.startSystem(Phaser.Physics.ARCADE); // start physics library

    game.physics.arcade.checkCollision.down = false; // check collisions against walls except bottom


    canvas = game.add.tileSprite(0,0, 800,600, 'space'); // paint the canvas


    // start making the bricks
    bricks = game.add.group(); // phaser lets you group objects - docs for extra methods
    bricks.enableBody = true; // enables a body to allow collision
    bricks.physicsBodyType = Phaser.Physics.ARCADE; // does the same for groups as game.physics.enable



    for (var y=0; y< incomingJson.numberOfRows; y++)
    {
        for (var x = 0; x< incomingJson.numberOfBricks; x++)
        {
            var brick = bricks.create(120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y+1) + '_1.png');  // x - y - png
            brick.body.bounce.set(1); // The elasticity of the Body when colliding. bounce.x/y = 1 means full rebound, bounce.x/y = 0.5 means 50% rebound velocity.
            brick.body.immovable = true; // An immovable Body will not receive any impacts from other bodies.
        }

    }

    // make the paddle

    paddle = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_big.png');// add sprite on x and y
    paddle.anchor.setTo(0.5,0.5); // set position of the texture relative to xy ----> centers texture to object http://www.goodboydigital.com/pixijs/docs/classes/Sprite.html#property_pivot
    game.physics.enable(paddle, Phaser.Physics.ARCADE); // enables the physics onto the paddle
    paddle.body.collideWorldBounds = true;
    paddle.body.bounce.set(1);
    paddle.body.immovable = true;

    // make the ball

    ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png'); // TO DO
    ball.anchor.setTo(0.5,0.5);
    ball.checkWorldBounds = true; // https://phaser.io/docs/2.3.0/Phaser.Component.InWorld.html

    game.physics.enable(ball, Phaser.Physics.ARCADE);

    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.animations.add('spin', [ 'ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png' ], 50, true, false) // we can call this with .play later

    ball.events.onOutOfBounds.add(ballLost, this); // ball drops below bottom -  triggers onOutOfBounds --> reset it

    scoreText = game.add.text(32, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
    livesText = game.add.text(680, 550, 'lives: 3', { font: "20px Arial", fill: "#ffffff", align: "left" });
    introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
    introText.anchor.setTo(0.5, 0.5);

    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(releaseBall, this);
    cursors = game.input.keyboard.createCursorKeys();

}

function update() {


    // power up for up and down?
    // TO DO fix ball going below the texture of the paddle in case of going up or down


    if (cursors.left.isDown)
    {
        paddle.x -= 7;
        if (ballOnPaddle)
        {
            ball.body.x = paddle.x;
            ball.body.y = paddle.y;
        }

    }
    else if (cursors.right.isDown)
    {
        paddle.x += 7;
        if (ballOnPaddle)
        {
            ball.body.x = paddle.x;
            ball.body.y = paddle.y;
        }
    }
    else if (cursors.up.isDown)
    {
        paddle.y -= 7;
        if (ballOnPaddle)
        {
            ball.body.x = paddle.x;
            ball.body.y = paddle.y;
        }
    }
    else if (cursors.down.isDown)
    {
        paddle.y += 7;
        if (ballOnPaddle)
        {
            ball.body.x = paddle.x;
            ball.body.y = paddle.y;
        }
    }

    game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this); // null -> callback, this = context
    game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);


}

function releaseBall() {
    if (ballOnPaddle)
    {
        ballOnPaddle = false;
        ball.body.velocity.y = -300;
        ball.body.velocity.x = -75;
        ball.animations.play('spin');
        introText.visible = false;
    }

}

function ballLost() {
    lives--;
    livesText.text = `lives: ${lives}`;

    if (lives === 0)
    {
        gameOver();
    }
    else {
        ballOnPaddle = true;
        ball.reset(paddle.body.x + 16, paddle.y - 16); // use paddle body this time instead of world (paddle has different x now)
        ball.animations.stop();
    }

}

function gameOver () {

    ball.body.velocity.setTo(0, 0);

    introText.text = 'Game Over!';
    introText.visible = true;

}

function ballHitBrick(_ball, _brick) {
    _brick.kill(); // removes brick from bricks
    score += 10;

    scoreText.text = `score ${score}`;

    if (bricks.countLiving() === 0)
    {
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




}

function ballHitPaddle(_ball, _paddle) {

    var difference =0;

    if (_ball.x < _paddle.x) { // ball is left of paddle

        difference = _paddle.x - _ball.x;
        _ball.body.velocity.x = (-10 * difference);
    }

    else if (_ball.x > _paddle.x) // ball is right of paddle
    {
        _ball.body.velocity.x = (10 * difference);
    }
    else { // ball in exact middle --> random x to prevent bouncing straight up
        _ball.body.velocity.x = 2 + Math.random() * 8 ;

    }
}

