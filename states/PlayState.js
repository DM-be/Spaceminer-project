


const playState = {

    preload: function()
    {
      ballOnPaddle = true; // we can access globals per state - change them according to state, before the state loads
      canvas = game.add.tileSprite(0,0, 800,600, 'space');
      createText();
      bindControls();
      makeBricks();
      makePaddle('paddle_big.png');
      makeBall('ball_1.png');

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
    }
};

