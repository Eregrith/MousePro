/*
*
* Mouse Pro
*
* Friends.js
*/

(function (Game, Display, Friends) {

    EventNode = document.getElementById('eventNode');
    
    Friends.newFriend = function(settings) {
        let friend = {
            ...settings,
            buyable: false,
            bought: 0,
            ticks: 0,
            getTicksNeededToActivate: function() { return this.baseTicksPerMove; },
            getName: function() { return this.name + (this.bought > 0 ? ' (lvl ' + this.bought + ')' : ''); },
            getActivationFrequencyDescription: function() {
                let activationsPerSecond = Display.framesPerSecond() / this.getTicksNeededToActivate();
                return 'Activates ' + (activationsPerSecond > 1 ? activationsPerSecond + ' times': 'once') + ' per second';
            },
            getCosts: function() {
                let costs = JSON.parse(JSON.stringify(this.baseCosts));
                for (let l in costs.levels) {
                    if (costs.levels.hasOwnProperty(l)) {
                        costs.levels[l] = Math.round(costs.levels[l] * Math.pow(this.costsIncrement, this.bought));
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
        getDescription: function() {
            return 'This little man will help you by moving his mouse as well!<br>Yay!<br>'
                + (this.bought > 0 ? 'Gives ' + this.bought + ' MM xp per activation.' : '') + '<br>'
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
            Game.acquireXp('MM', this.bought);
        }
    });
    Friends.newFriend({
        name: 'Barnabeus',
        shortName: 'barnabeus',
        getDescription: function() {
            return 'This little man will help you by clicking his mouse as well!<br>Yay!<br>'
                + (this.bought > 0 ? 'Gives ' + this.bought + ' MC xp per activation.' : '') + '<br>'
                + this.getActivationFrequencyDescription();
        },
        baseTicksPerMove: 100,
        costsIncrement: 1.6,
        baseCosts: {
            levels: {
                MC: 2
            }
        },
        activate: function() {
            Game.acquireXp('MC', this.bought);
        }
    });

    Friends.friend = function(shortName) {
        return Friends.friends.filter(f => f.shortName == shortName)[0];
    }

    Friends.unlock = function(shortName) {
        Friends.friend(shortName).buyable = true;
		Friends.refreshFriends();
    }

    Friends.refreshFriends = function() {
		let event = new Event('refreshFriends');
		EventNode.dispatchEvent(event);
    }

	Friends.buy = function(shortName) {
		let friend = Friends.friend(shortName);
        
        let costs = friend.getCosts();
		if (!Game.hasCurrency(costs)) return;
		
		Game.spend(costs);
		friend.bought++;

		if (friend.onBuy !== undefined)
			friend.onBuy();
		
		Friends.refreshFriends();
	}
    
    Friends.tick = function(friend) {
        if (!friend.bought) return;
        friend.ticks++;

        while (friend.ticks >= friend.getTicksNeededToActivate()) {
            friend.ticks -= friend.getTicksNeededToActivate();
            friend.activate();
        }
    }

})(gameObjects.Game, gameObjects.Display, gameObjects.Friends);