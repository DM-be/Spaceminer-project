

const gameMenu = {
    addMenuOption: function(text, callback) {

        var txt = game.add.text(30, (this.optionCount * 80) + 200, text, fontObject);
        var onOver = (target) => {
            target.fill = "#ff7cb1";
            target.stroke = "rgba(0,0,0,0)"
        };
        var onOut = (target) => {
            target.fill = "#FFF";
            target.stroke = "rgba(0,0,0,0)";

        };
        txt.stroke = "rgba(0,0,0,0";
        txt.strokeThickness = 4;
        txt.inputEnabled = true;
        txt.events.onInputUp.add(callback);
        txt.events.onInputOver.add(onOver);
        txt.events.onInputOut.add(onOut);
        this.optionCount++;

    },
    init: function ()
    {
        this.titleText = game.make.text(game.world.centerX, 100, "TITLE", {
            font: 'bold 60pt',
            fill: '#ff7cb1',
            align: 'center'
        });
        this.titleText.setShadow(3,3, 'rgba(0,0,0,0.5)', 5);
        this.titleText.anchor.set(0.5);

    },
    preload: function() {
      this.optionCount = 1;
    },

    create: function () {
        // add music
       // game.stage.disableVisibilityChange = true; this would keep music running throughout menus instead of pausing
        game.add.sprite(0,0, 'stars');
        game.add.existing(this.titleText);

        this.addMenuOption('Start', (target) => game.state.start('level1PlayState'));
        this.addMenuOption('Options', (target) => console.log('clicked options'))
    }

};