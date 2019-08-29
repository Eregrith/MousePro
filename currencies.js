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
            levelsLabel: settings.levelsLabel || 'levels',
            xpLabel: settings.xpLabel || 'xp',
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
                this.saveableState.xp = Math.round(xp * 100) / 100;
            },
			xpIncreaseFactor: settings.xpIncreaseFactor || 1.2,
            xpRequiredForNextLevel: function () {
				return Math.round(settings.xpRequiredForNextLevel * Math.pow(this.xpIncreaseFactor, this.saveableState.level));
			},
            levelUp: function() {
                this.saveableState.xp -= this.xpRequiredForNextLevel();
                this.saveableState.level++;
                if (settings.levelUp)
                    settings.levelUp(this);
                if (this.isToBeDisplayedNormally)
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
                this.saveableState.xp = Math.round(this.saveableState.xp * 100) / 100;
                if (isNaN(this.saveableState.xp)) this.saveableState.xp = 0;
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