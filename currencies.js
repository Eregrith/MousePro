/*
*
* Mouse Pro
*
* Currencies.js
*/

(function(Game, Display, Currencies) {
    
    Currencies.newCurrency = function(settings) {
        let currency = {
            ...settings,
            saveableState: {
                xp: 0,
                level: 0,
                highestLevelAttained: 0
            },
            isToBeDisplayedNormally: settings.isToBeDisplayedNormally === undefined ? true : settings.isToBeDisplayedNormally,
            getLevel: function() {
                return this.saveableState.level;
            },
            getHighestLevelAttained: function() {
                return this.saveableState.highestLevelAttained;
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
                settings.levelUp(this);
                Display.notifyLevelUp(this);
                if (this.saveableState.highestLevelAttained == undefined
                    || this.saveableState.level > this.saveableState.highestLevelAttained)
                    this.saveableState.highestLevelAttained = this.saveableState.level;
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

})(gameObjects.Game, gameObjects.Display, gameObjects.Currencies);