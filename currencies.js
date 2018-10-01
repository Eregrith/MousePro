/*
*
* Mouse Pro
*
* Currencies.js
*/

(function(Game, Shop, Currencies) {
    
    Currencies.newCurrency = function(settings) {
        let currency = {
            ...settings,
			xp: 0,
            level: 0,
			xpIncreaseFactor: settings.xpIncreaseFactor || 1.2,
            xpRequiredForNextLevel: function () {
				return Math.round(settings.xpRequiredForNextLevel * Math.pow(this.xpIncreaseFactor, this.level));
			},
            levelUp: function() {
                this.xp -= this.xpRequiredForNextLevel();
                this.level++;
                settings.levelUp();
                Game.checkUnlocks();
            },
            levelDown: function(amount) {
                this.level -= amount;
                this.checkLevelUps();
            },
            canLevelUp: function() {
                return this.xp >= this.xpRequiredForNextLevel();
            },
            acquireXp: function(amount) {
                this.xp += amount;
                if (settings.xpGained)
                    settings.xpGained(this);
                this.checkLevelUps();
            },
            checkLevelUps: function() {
                while (this.canLevelUp()) {
                    this.levelUp();
                    Game.triggerEvent('levelUp', { currency: this });
                }
            },
            xpProgressPercent: function() {
                return (this.xp / this.xpRequiredForNextLevel()) * 100.0;
            }
        };

        Game.currencies.push(currency);
    }

})(gameObjects.Game, gameObjects.Shop, gameObjects.Currencies);