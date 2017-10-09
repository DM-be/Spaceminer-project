/*** GAME SETUP ***/

//TODO: figure out how we are getting the data and refactor
const makeBricks = (options) => {

    options = incomingJson; // make brick based on some options (returned from server)
    //TODO: implement options based on server data


    let bricks = game.add.group(); // phaser lets you group objects - docs for extra methods
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
    return bricks;


};


const makePaddle = (sprite) => {
    paddle = game.add.sprite(game.world.centerX, 500, 'breakout2', 'paddle_ark.png');// add sprite on x and y
    paddle.anchor.setTo(0.5,0.5); // set position of the texture relative to xy ----> centers texture to object http://www.goodboydigital.com/pixijs/docs/classes/Sprite.html#property_pivot
    game.physics.enable(paddle, Phaser.Physics.ARCADE); // enables the physics onto the paddle
    paddle.body.collideWorldBounds = true;
    paddle.body.bounce.set(1);
    paddle.body.immovable = true;
};


const makeBall = () => {
    let ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'ball', "ball.png"); // TO DO
    ball.anchor.setTo(0.5, 0.5);
    ball.checkWorldBounds = true; // https://phaser.io/docs/2.3.0/Phaser.Component.InWorld.html
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.collideWorldBounds = true;
    ball.body.isCircle = true;
    ball.body.setCircle();
    ball.body.bounce.set(1);
    ball.animations.add('spin', ['ball.png', 'ball.png', 'ball.png', 'ball.png', 'ball.png'], 50, true, false) // we can call this with .play later
    ball.events.onOutOfBounds.add(ballLost, this); // ball drops below bottom -  triggers onOutOfBounds --> re
    return ball;
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

