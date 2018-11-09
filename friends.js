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
                ticks: 0
            },
            getLevel: function() {
                return this.saveableState.bought;
            },
            canBuy: function() {
                return this.saveableState.buyable;
            },
            getXpPerActivation: function() {
                return this.saveableState.bought;
            },
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
            },
        }

        Friends.friends.push(friend);
    }

    Friends.newFriend({
        name: 'Aldo',
        shortName: 'aldo',
        icon: 'user-circle',
        getDescription: function() {
            return 'This little man will help you by moving his mouse as well!<br>Yay!<br>'
                + (this.getXpPerActivation() > 0 ? 'Gives ' + this.getXpPerActivation() + ' MM xp per activation.' : '') + '<br>'
                + this.getActivationFrequencyDescription();
        },
        baseTicksPerMove: 10,
        costsIncrement: 1.6,
        baseCosts: {
            levels: {
                MM: 2
            }
        },
        activate: function() {
            Game.acquireXp('MM', this.getXpPerActivation());
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
                + (this.getXpPerActivation() > 0 ? 'Gives ' + this.getXpPerActivation() + ' MC xp per activation.' : '') + '<br>'
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