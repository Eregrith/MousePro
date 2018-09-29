/*
*
* Mouse Pro
*
* Shop.js
*/

(function (Game, Friends, Shop) {

	EventNode = document.getElementById('eventNode');

	Shop.boosts = [
		{
			name: 'Mouse mover XT-PRO',
			getDescription: function() { return 'This awesome mouse-addon gives you ' + this.bonusXp + ' MM XP every 5 points of MM XP' },
			shortName: 'xtpro',
			cost: {
				xp: {
					MM: 110,
					MC: 11
				}
			},
			buyable: false,
			bought: false,
			bonusXp: 3
		},
		{
			name: 'Mouse clicker DM-BLU',
			getDescription: function() { return 'This awesome mouse-addon gives you ' + this.bonusXp + ' MC XP every 5 points of MC XP'; },
			shortName: 'dmblu',
			cost: {
				xp: {
					MM: 85,
					MC: 14
				}
			},
			buyable: false,
			bought: false,
			bonusXp: 3
		},
		{
			name: 'Mouse XP transfer ZB-GLO',
			getDescription: function() { return 'This awesome mouse-addon gives you ' + this.bonusXp + ' XP in the other proficiency when you level up one'; },
			shortName: 'zbglo',
			cost: {
				xp: {
					MM: 299,
					MC: 23
				}
			},
			buyable: false,
			bought: false,
			bonusXp: 20
		},
		{
			name: 'Addon Enhancer',
			getDescription: function() { return this.buyable ?
				'This little device will double the effects of XT-PRO, DM-BLU and ZB-GLO addons'
				: 'This little device multiplies the effects of XT-PRO, DM-BLU and ZB-GLO addons by ' + this.power; },
			shortName: 'addonenhancer',
			cost: {
				xp: { },
				levels: {
					MM: 10,
					MC: 10
				}
			},
			buyable: false,
			bought: false,
			power: 1,
			onBuy: function () {
				this.power *= 2;
				if (!Shop.has('friends'))
					Shop.unlock('friends');
			}
		},
		{
			name: 'Friends',
			getDescription: function() { return this.bought ? 'Friends are AWESOOOME!!' : 'It\'s dangerous to go alone. Take this!'; },
			shortName: 'friends',
			cost: {
				xp: { },
				levels: {
					MM: 10,
					MC: 10
				}
			},
			buyable: false,
			bought: false,
			onBuy: function () {
				Friends.refreshFriends();
			}
		}
	];
	
	Shop.boost = function(shortName) {
		return Shop.boosts.filter(b => b.shortName == shortName)[0];
	}
	
	Shop.has = function(shortName) {
		return Shop.boost(shortName).bought;
	}
	
	Shop.refreshShop = function() {
		let event = new Event('refreshShop');
		EventNode.dispatchEvent(event);
	}
	
	Shop.refreshBoostsOwned = function() {
		let event = new Event('refreshBoostsOwned');
		EventNode.dispatchEvent(event);
	}
	
	Shop.buy = function(shortName) {
		let boost = Shop.boost(shortName);
		
		if (!Game.hasCurrency(boost.cost)) return;
		
		Game.spend(boost.cost);
		boost.bought = true;
		boost.buyable = false;

		if (boost.onBuy !== undefined)
			boost.onBuy();
		
		Shop.refreshShop();
		Shop.refreshBoostsOwned();
		return;
	}
	
	Shop.unlock = function(shortName) {
		let boost = Shop.boost(shortName);
		boost.buyable = true;
		Shop.refreshShop();
	}

})(gameObjects.Game, gameObjects.Friends, gameObjects.Shop);