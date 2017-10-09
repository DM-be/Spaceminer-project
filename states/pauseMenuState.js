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
