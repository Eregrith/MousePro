/*
*
* Mouse Pro
*
* Friends.js
*/

(function (Game, Friends) {

    EventNode = document.getElementById('eventNode');
    
    Friends.friends = [
        {
            name: 'Aldo',
            getName: function() { return this.name + (this.bought > 0 ? ' (lvl ' + this.bought + ')' : ''); },
            shortName: 'aldo',
            getDescription: function() { return 'This little man will help you by moving his mouse as well!<br>Yay!<br>'
                + (this.bought > 0 ? 'Gives ' + this.bought + ' MM xp per activation.' : ''); },
            baseTicksPerMove: 10,
            costsIncrement: 1.6,
            getCosts: function() {
                let costs = {
                    levels: {
                        MM: 2
                    }
                };
                for (let l in costs.levels) {
                    if (costs.levels.hasOwnProperty(l)) {
                        costs.levels[l] = Math.round(costs.levels[l] * Math.pow(this.costsIncrement, this.bought));
                    }
                }
                return costs;
            },
            buyable: true,
            bought: 0,
            getTicksNeededToActivate: function() { return this.baseTicksPerMove; },
            ticks: 0,
            activate: function() {
                Game.acquireXp('MM', this.bought);
            }
        },
        {
            name: 'Barnabeus',
            getName: function() { return this.name + (this.bought > 0 ? ' (lvl ' + this.bought + ')' : ''); },
            shortName: 'barnabeus',
            getDescription: function() { return 'This little man will help you by clicking his mouse as well!<br>Yay!<br>'
                + (this.bought > 0 ? 'Gives ' + this.bought + ' MC xp per activation.' : ''); },
            baseTicksPerMove: 100,
            costsIncrement: 1.6,
            getCosts: function() {
                let costs = {
                    levels: {
                        MC: 2
                    }
                };
                for (let l in costs.levels) {
                    if (costs.levels.hasOwnProperty(l)) {
                        costs.levels[l] = Math.round(costs.levels[l] * Math.pow(this.costsIncrement, this.bought));
                    }
                }
                return costs;
            },
            buyable: false,
            bought: 0,
            getTicksNeededToActivate: function() { return this.baseTicksPerMove; },
            ticks: 0,
            activate: function() {
                Game.acquireXp('MC', this.bought);
            }
        }
    ];

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

})(gameObjects.Game, gameObjects.Friends);