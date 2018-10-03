/*
*
* Mouse Pro
*
* Currencies.js
*/

(function(Game, Display, Shop, Currencies) {
    
    Currencies.newCurrency = function(settings) {
        let currency = {
            ...settings,
            saveableState: {
                xp: 0,
                level: 0
            },
            getLevel: function() {
                return this.saveableState.level;
            },
            getXp: function() {
                return this.saveableState.xp;
            },
            setXp: function(xp) {
                this.saveableState.xp = xp;
            },
			xpIncreaseFactor: settings.xpIncreaseFactor || 1.2,
            xpRequiredForNextLevel: function () {
				return Math.round(settings.xpRequiredForNextLevel * Math.pow(this.xpIncreaseFactor, this.saveableState.level));
			},
            levelUp: function() {
                this.saveableState.xp -= this.xpRequiredForNextLevel();
                this.saveableState.level++;
                settings.levelUp();
                Display.notifyLevelUp(this);
                Game.checkUnlocks();
            },
            levelDown: function(amount) {
                this.saveableState.level -= amount;
                this.checkLevelUps();
            },
            canLevelUp: function() {
                return this.saveableState.xp >= this.xpRequiredForNextLevel();
            },
            acquireXp: function(amount) {
                this.saveableState.xp += amount;
                if (settings.xpGained)
                    settings.xpGained(this);
                this.checkLevelUps();
            },
            checkLevelUps: function() {
                while (this.canLevelUp()) {
                    this.levelUp();
                }
            },
            xpProgressPercent: function() {
                return (this.saveableState.xp / this.xpRequiredForNextLevel()) * 100.0;
            }
        };

        Game.currencies.push(currency);
    }

})(gameObjects.Game, gameObjects.Display, gameObjects.Shop, gameObjects.Currencies);