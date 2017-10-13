
let ball;
let bricks;

const level1PlayState = {

    preload: function()
    {
      ballOnPaddle = true; // we can access globals per state - change them according to state, before the state loads
      canvas = game.add.tileSprite(200,0, 800,600, 'space');
      createText();
      bindControls();
      bricks = makeBricks();
      makePaddle('paddle_big.png');
      ball = makeBall();


    },
    create: function () {
      game.world.setBounds((game.width - canvas.width) / 2,0, 800,600); // camera bounds get reset to the current world!
      game.camera.bounds.x = 0; // this would get 200 from the world, set it to 0 so we can show the rest
       // game.world.camera.reset()

    },
    update: function() {
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

    },
    render: function () {
      game.debug.inputInfo(16,16)
    }
};

