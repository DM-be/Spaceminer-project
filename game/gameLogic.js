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