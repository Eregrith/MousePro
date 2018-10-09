/*
*
* Mouse Pro
*
* Shop.js
*/

(function (Game, Boosts, Friends, Display, Shop, Tabs) {

	Boosts.newBoost({
		name: 'Mouse mover XT-PRO',
		getDescription: function() { return 'This awesome mouse-addon gives you ' + this.bonusXp + ' MM XP every 5 points of MM XP' },
		shortName: 'xtpro',
		cost: {
			xp: {
				MM: 110,
				MC: 11
			}
		},
		bonusXp: 3
	});
	Boosts.newBoost({
		name: 'Mouse clicker DM-BLU',
		getDescription: function() { return 'This awesome mouse-addon gives you ' + this.bonusXp + ' MC XP every 5 points of MC XP'; },
		shortName: 'dmblu',
		cost: {
			xp: {
				MM: 85,
				MC: 14
			}
		},
		bonusXp: 3
	});
	Boosts.newBoost({
		name: 'Mouse XP transfer ZB-GLO',
		getDescription: function() { return 'This awesome mouse-addon gives you ' + this.bonusXp + ' XP in the other proficiency when you level up one'; },
		shortName: 'zbglo',
		cost: {
			xp: {
				MM: 299,
				MC: 23
			}
		},
		bonusXp: 20
	});
	Boosts.newBoost({
		name: 'Settings',
		getDescription: function() { return 'Let\'s tune this thing'; },
		shortName: 'settings',
		cost: {
			levels: {
				MM: 1,
				MC: 1
			}
		},
		buy: function () {
			Tabs.unlock('game');
			Tabs.unlock('settings');
		}
	});
	Boosts.newBoost({
		name: 'Addon Enhancer',
		getDescription: function() {
			return this.buyable ?
				'This little device will double the effects of XT-PRO, DM-BLU and ZB-GLO addons'
				: 'This little device multiplies the effects of XT-PRO, DM-BLU and ZB-GLO addons by ' + this.power;
		},
		shortName: 'addonenhancer',
		cost: {
			levels: {
				MM: 10,
				MC: 10
			}
		},
		power: 1,
		buy: function (thisBoost) {
			thisBoost.power *= 2;
			if (!Shop.has('friends'))
				Shop.unlock('friends');
		}
	});
	Boosts.newBoost({
		name: 'Friends',
		getDescription: function() { return this.bought ? 'Friends are AWESOOOME!!' : 'It\'s dangerous to go alone. Take this!'; },
		shortName: 'friends',
		cost: {
			levels: {
				MM: 10,
				MC: 10
			}
		},
		buy: function () {
			Friends.unlock('aldo');
		}
	});
	
	Shop.boost = function(shortName) {
		return Shop.boosts.filter(b => b.shortName == shortName)[0];
	}
	
	Shop.has = function(shortName) {
		return Shop.boost(shortName).isBought();
	}
	
	Shop.buy = function(shortName) {
		let boost = Shop.boost(shortName);
		
		if (!Game.hasCurrency(boost.getCost())) return;
		
		Game.spend(boost.getCost());
		boost.buy();
		Display.needsRepaintImmediate = true;
	}
	
	Shop.unlock = function(shortName) {
		let boost = Shop.boost(shortName);
		boost.unlock();
		Display.needsRepaintImmediate = true;
	}

})(gameObjects.Game, gameObjects.Boosts, gameObjects.Friends, gameObjects.Display, gameObjects.Shop, gameObjects.Tabs);