
const splash =  {

    loadScripts: () => {
        game.load.script('level1playState', '/states/level1PlayState.js');
        game.load.script('gameLogic', '/game/gameLogic.js');
        game.load.script('gameSetup', '/game/gameSetup.js');
        game.load.script('levelMenu', '/states/levelMenuState.js');
        game.load.script('pauseMenuState', '/states/pauseMenuState.js' );
        game.load.script('gameMenu', '/states/gameMenu.js')

    },

    addGamestates: () => {
        game.state.add('levelMenu', levelMenuState);
        game.state.add('level1PlayState', level1PlayState);
        game.state.add('pause', pauseMenuState);
        game.state.add('gameMenu', gameMenu)
    },

    loadImages: () => {
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

    loadFonts: () => {
    },

    loadBackGroundMusic: () => {

    },

    loadSoundEffects: () => {

    },

    init: function () { /// gets called before preload, use to build the needed sprites
        this.loadingBar = game.make.sprite(game.world.centerX - (387/2), 400, 'loading');
        this.backGround = game.make.sprite(0,0, 'stars');
        this.logo = game.make.sprite(game.world.centerX, 200,  'logo');
        this.status = game.make.text(game.world.centerX, 380, 'loading...' , {fill: 'white'});
        utils.centerGameObjects([this.logo, this.status]);

    },
    preload: function() {
        game.add.existing(this.backGround);
        game.add.existing(this.logo).scale.setTo(0.5);
        game.add.existing(this.loadingBar);
        game.add.existing(this.status);
        game.load.setPreloadSprite(this.loadingBar); // bars fills up automatically

        this.loadImages();
        this.loadScripts();

    },
    create: function() // create gets called AFTER preload is done
    {
        this.status.setText('Ready');
        this.addGamestates();

        setTimeout(() => {

            game.state.start('gameMenu');
        }, 4000)

    },
};