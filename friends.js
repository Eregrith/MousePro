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
                if (this.saveableState.bloodEaten == null) this.saveableState.bloodEaten = 0;
                this.saveableState.bloodEaten += amount;
                let isFull = this.saveableState.bloodEaten >= this.bloodNeededToBeFull;
                if (isFull && typeof(settings.isFullOfBlood) === typeof(Function)) {
                    settings.isFullOfBlood();
                }
            },
            getFullnessPercent: function() {
                if (!this.saveableState.bloodEaten) return 0;
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
            getTicksNeededToActivate: function() { return this.baseMSPerMove; },
            getName: function() { return this.name + (this.saveableState.bought > 0 ? ' (lvl ' + this.saveableState.bought + ')' : ''); },
            getActivationFrequencyDescription: function() {
                let activationsPerSecond = 1000 / this.getTicksNeededToActivate();
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
            let desc;
            if (!Shop.has('haxxoraldo')) {
                desc = 'This little man will help you by moving his mouse as well!<br>Yay!<br>'
                    + (this.getXpPerActivation() > 0 ? 'Gives ' + Display.beautify(this.getXpPerActivation()) + ' ' +Game.currency('MM').iconTag + 'MM xp per activation' + (Shop.has('bloodthirstyaldo') ? ' (Before multipliers)' : '') + '.' : '') + '<br>';
            } else {
                desc = 'This little man will help you browsing the dark web by listing every IP one after the other.<br>'
                    + 'Gives ' + Display.beautify(this.getDWKXpPerActivation()) + ' ' + Game.currency('DWK').iconTag + ' DWK xp per activation<br>';
            }
            return desc + this.getActivationFrequencyDescription();
        },
        baseMSPerMove: 100,
        costsIncrement: 1.6,
        baseCosts: {
            levels: {
                MM: 2
            }
        },
        applyXpBonus: function(baseXp) {
            if (Shop.has('bloodfullaldo')) {
                baseXp *= 1 + Math.pow(1 + Shop.boost('bloodfullaldo').getPower(), Shop.boost('sacrifice-mm').getPower());
                if (Shop.has('somuchblood')) {
                    baseXp *= Math.floor(Game.currency('blood').getXp());
                }
            }
            return baseXp;
        },
        activate: function(activations) {
            let xp = this.getXpPerActivation() * activations;
            if (Shop.has('deepcuts')) {
                let chance = 0.10;
                if (chance >= Math.random()) {
                    Game.acquireXp('blood', 0.1);
                }
            }
            if (Shop.has('bloodthirstyaldo') && Shop.boost('bloodthirstyaldo').isActive()) {
                if (Game.hasCurrency({ xp: { blood: 0.01 } })) {
                    Game.spend({ xp: { blood: 0.01 } });
                    this.hasEatenBlood(0.01);
                    xp *= 2;
                }
            }
            Game.acquireXp('MM', xp);
            if (Shop.has('haxxoraldo')) {
                let dwkxp = this.getDWKXpPerActivation() * activations;
                Game.acquireXp('DWK', dwkxp);
            }
        },
        getDWKXpPerActivation: function() {
            return 0.1 * this.getLevel();
        },
        bloodNeededToBeFull: 50,
        isFullOfBlood: function() {
            if (!Shop.has('bloodfullaldo')) {
                Shop.unlock('bloodfullaldo');
            }
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
            let desc;
            if (!Shop.has('haxxorbarnabeus')) {
                desc = 'This little man will help you by clicking his mouse as well!<br>Yay!<br>'
                    + (this.getXpPerActivation() > 0 ? 'Gives ' + Display.beautify(this.getXpPerActivation()) + ' ' +Game.currency('MC').iconTag + 'MC xp per activation.' + (Shop.has('bloodthirstyaldo') ? ' (Before multipliers)' : '') + '.' : '') + '<br>'
            } else {
                desc = 'This little man will help you browsing the dark web by listing every IP one after the other.<br>'
                    + 'Gives ' + Display.beautify(this.getDWKXpPerActivation()) + ' ' + Game.currency('DWK').iconTag + ' DWK xp per activation<br>';
            }
            return desc + this.getActivationFrequencyDescription();;
        },
        getDWKXpPerActivation: function() {
            return 0.5 * this.getLevel();
        },
        baseMSPerMove: 500,
        costsIncrement: 1.6,
        baseCosts: {
            levels: {
                MC: 2
            }
        },
        applyXpBonus: function(baseXp) {
            if (Shop.has('bloodfullbarnabeus')) {
                baseXp *= 1 + Math.pow(1 + Shop.boost('bloodfullbarnabeus').getPower(), Shop.boost('sacrifice-mc').getPower());
                if (Shop.has('somuchblood')) {
                    baseXp *= Math.floor(Game.currency('blood').getXp());
                }
            }
            if (Shop.has('hackingfordummies')) {
                baseXp *= Math.pow(1.1337, Shop.boost('hackingfordummies').getPower());
            }
            return baseXp;
        },
        bloodNeededToBeFull: 50,
        activate: function(activations) {
            let xp = this.getXpPerActivation() * activations;
            if (Shop.has('deepcuts')) {
                let chance = 0.10;
                if (chance >= Math.random()) {
                    Game.acquireXp('blood', 1);
                }
            }
            if (Shop.has('bloodthirstybarnabeus') && Shop.boost('bloodthirstybarnabeus').isActive()) {
                if (Game.hasCurrency({ xp: { blood: 0.1 } })) {
                    Game.spend({ xp: { blood: 0.1 } });
                    this.hasEatenBlood(0.1);
                    xp *= 2;
                }
            }
            Game.acquireXp('MC', xp);
            if (Shop.has('haxxorbarnabeus')) {
                let dwkxp = this.getDWKXpPerActivation() * activations;
                Game.acquireXp('DWK', dwkxp);
            }
        },
        isFullOfBlood: function() {
            if (!Shop.has('bloodfullbarnabeus')) {
                Shop.unlock('bloodfullbarnabeus');
            }
        },
        onBuy: function() {
            Game.checkUnlocks();
        }
    });

    Friends.friend = function(shortName) {
        return Friends.friends.filter(f => f.shortName == shortName)[0];
    }

    Friends.unlock = function(shortName) {
        Friends.friend(shortName).saveableState.buyable = true;
    }

	Friends.buy = function(shortName) {
		let friend = Friends.friend(shortName);
        
        let costs = friend.getCosts();
		if (!Game.hasCurrency(costs)) return;
		
		Game.spend(costs);
		friend.saveableState.bought++;

		if (friend.onBuy !== undefined)
            friend.onBuy();
	}
    
    Friends.tick = function(friend, elapsedMilliseconds) {
        if (!friend.saveableState.bought) return;
        friend.saveableState.ticks += elapsedMilliseconds;

        if (friend.saveableState.ticks >= friend.getTicksNeededToActivate()) {
            let activations = Math.floor(friend.saveableState.ticks / friend.getTicksNeededToActivate());
            friend.activate(activations);
            friend.saveableState.ticks -= activations * friend.getTicksNeededToActivate();
        }
    }

})(gameObjects.Game, gameObjects.Display, gameObjects.Shop, gameObjects.Friends);