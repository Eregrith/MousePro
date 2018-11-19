/*
*
* Mouse Pro
*
* Friends.js
*/

(function (Game, Display, Shop, Friends) {

    Friends.newFriend = function(settings) {
        let friend = {
            ...settings,
            saveableState: {
                buyable: false,
                bought: 0,
                ticks: 0,
                bloodEaten: 0
            },
            hasEatenBlood: function(amount) {
                let wasFull = this.saveableState.bloodEaten >= this.bloodNeededToBeFull;
                if (this.saveableState.bloodEaten == null) this.saveableState.bloodEaten = 0;
                this.saveableState.bloodEaten += amount;
                let isFull = this.saveableState.bloodEaten >= this.bloodNeededToBeFull;
                if (!wasFull && isFull && typeof(settings.isFullOfBlood) === typeof(Function)) {
                    settings.isFullOfBlood();
                }
            },
            getFullnessPercent: function() {
                if (!this.bloodNeededToBeFull) return 0;
                if (this.saveableState.bloodEaten >= this.bloodNeededToBeFull) return 100;
                return (this.saveableState.bloodEaten / this.bloodNeededToBeFull) * 100;
            },
            getLevel: function() {
                return this.saveableState.bought;
            },
            canBuy: function() {
                return this.saveableState.buyable;
            },
            getXpPerActivation: function() {
                return this.applyXpBonus(this.saveableState.bought);
            },
            applyXpBonus: settings.applyXpBonus || ((baseXp) => baseXp),
            getTicksNeededToActivate: function() { return this.baseTicksPerMove; },
            getName: function() { return this.name + (this.saveableState.bought > 0 ? ' (lvl ' + this.saveableState.bought + ')' : ''); },
            getActivationFrequencyDescription: function() {
                let activationsPerSecond = Display.framesPerSecond() / this.getTicksNeededToActivate();
                return 'Activates ' + (activationsPerSecond > 1 ? activationsPerSecond + ' times': 'once') + ' per second';
            },
            getCosts: function() {
                let costs = JSON.parse(JSON.stringify(this.baseCosts));
                for (let l in costs.levels) {
                    if (costs.levels.hasOwnProperty(l)) {
                        costs.levels[l] = Math.round(costs.levels[l] * Math.pow(this.costsIncrement, this.saveableState.bought));
                    }
                }
                return costs;
            }
        }

        Friends.friends.push(friend);
    }

    Friends.newFriend({
        name: 'Aldo',
        shortName: 'aldo',
        icon: 'user-circle',
        getDescription: function() {
            return 'This little man will help you by moving his mouse as well!<br>Yay!<br>'
                + (this.getXpPerActivation() > 0 ? 'Gives ' + Display.beautify(this.getXpPerActivation()) + ' MM xp per activation' + (Shop.has('bloodthirstyaldo') ? ' (Before multipliers)' : '') + '.' : '') + '<br>'
                + this.getActivationFrequencyDescription();
        },
        baseTicksPerMove: 10,
        costsIncrement: 1.6,
        baseCosts: {
            levels: {
                MM: 2
            }
        },
        applyXpBonus: function(baseXp) {
            if (Shop.has('bloodfullaldo')) {
                baseXp *= 1 + Math.pow(1 + Shop.boost('bloodfullaldo').getPower(), Shop.boost('sacrifice-mm').getPower());
            }
            return baseXp;
        },
        activate: function() {
            let xp = this.getXpPerActivation();
            if (Shop.has('bloodthirstyaldo') && Shop.boost('bloodthirstyaldo').isActive()) {
                if (Game.hasCurrency({ xp: { blood: 0.01 } })) {
                    Game.spend({ xp: { blood: 0.01 } });
                    this.hasEatenBlood(0.01);
                    xp *= 2;
                }
            }
            Game.acquireXp('MM', xp);
        },
        bloodNeededToBeFull: 50,
        isFullOfBlood: function() {
            Shop.unlock('bloodfullaldo');
        },
        onBuy: function() {
            Game.checkUnlocks();
        }
    });
    Friends.newFriend({
        name: 'Barnabeus',
        shortName: 'barnabeus',
        icon: 'user-circle fa-lighter',
        getDescription: function() {
            return 'This little man will help you by clicking his mouse as well!<br>Yay!<br>'
                + (this.getXpPerActivation() > 0 ? 'Gives ' + this.getXpPerActivation().toFixed(2) + ' MC xp per activation.' : '') + '<br>'
                + this.getActivationFrequencyDescription();
        },
        baseTicksPerMove: 50,
        costsIncrement: 1.6,
        baseCosts: {
            levels: {
                MC: 2
            }
        },
        activate: function() {
            Game.acquireXp('MC', this.getXpPerActivation());
        },
        onBuy: function() {
            if (this.bought >= 5) {
                Shop.unlock('zbglotransferup');
            }
        }
    });

    Friends.friend = function(shortName) {
        return Friends.friends.filter(f => f.shortName == shortName)[0];
    }

    Friends.unlock = function(shortName) {
        Friends.friend(shortName).saveableState.buyable = true;
		Display.needsRepaintImmediate = true;
    }

	Friends.buy = function(shortName) {
		let friend = Friends.friend(shortName);
        
        let costs = friend.getCosts();
		if (!Game.hasCurrency(costs)) return;
		
		Game.spend(costs);
		friend.saveableState.bought++;

		if (friend.onBuy !== undefined)
            friend.onBuy();

        Display.needsRepaintImmediate = true;
	}
    
    Friends.tick = function(friend) {
        if (!friend.saveableState.bought) return;
        friend.saveableState.ticks++;

        while (friend.saveableState.ticks >= friend.getTicksNeededToActivate()) {
            friend.saveableState.ticks -= friend.getTicksNeededToActivate();
            friend.activate();
        }
    }

})(gameObjects.Game, gameObjects.Display, gameObjects.Shop, gameObjects.Friends);