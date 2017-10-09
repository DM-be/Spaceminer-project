
const levelMenuState = {
    create: () =>  {
        game.add.text(game.x,game.y, `level: ${level}, press S to start`, fontObject);
        const sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        sKey.onDown.addOnce(levelMenuState.start, this);

    },
    start: () => game.state.start('play')

};
