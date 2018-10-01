/*
*
* Mouse Pro
*
* Currencies.js
*/

(function(Game, Currencies) {
    
    Currencies.newCurrency = function(settings) {
        let currency = {
            ...settings,
			xp: 0,
            level: 0,
			xpRequiredForNextLevel: function () {
				return Math.round(100 * Math.pow(this.xpIncreaseFactor, this.level));
			},
            levelUp: function() {
                this.level++;
                settings.levelUp();
                Game.checkUnlocks();
            },
			xpIncreaseFactor: settings.xpIncreaseFactor || 1.2,
        };

        Game.currencies.push(currency);
    }

})(gameObjects.Game, gameObjects.Currencies);