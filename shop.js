/*
*
* Mouse Pro
*
* Shop.js
*/

(function (Game, Shop) {

	EventNode = document.getElementById('eventNode');

	Shop.boosts = [
		{
			name: 'Mouse mover XT-PRO',
			description: 'This awesome mouse-addon gives you 1 MM XP every 5 points of MM XP',
			shortName: 'xtpro',
			cost: {
				xp: {
					MM: 110,
					MC: 11
				}
			},
			buyable: false,
			bought: false
		},
		{
			name: 'Mouse clicker DM-BLU',
			description: 'This awesome mouse-addon gives you 1 MC XP every 5 points of MC XP',
			shortName: 'dmblu',
			cost: {
				xp: {
					MM: 85,
					MC: 14
				}
			},
			buyable: false,
			bought: false
		},
		{
			name: 'Mouse XP transfer ZB-GLO',
			description: 'This awesome mouse-addon gives you 5 XP in the other proficiency when you level up one',
			shortName: 'zbglo',
			cost: {
				xp: {
					MM: 299,
					MC: 23
				}
			},
			buyable: false,
			bought: false
		},
		{
			name: 'Addon Enhancer',
			description: 'This little device will double the effects of XT-PRO, DM-BLU and ZB-GLO addons',
			shortName: 'addonenhancer',
			cost: {
				xp: { },
				levels: {
					MM: 10,
					MC: 10
				}
			},
			buyable: false,
			bought: false
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
	
	Shop.buy = function(shortName) {
		if (Shop.has(shortName)) return;
		let boost = Shop.boost(shortName);
		
		if (!Game.hasCurrency(boost.cost)) return;
		
		Game.spend(boost.cost);
		boost.bought = true;
		boost.buyable = false;
		
		Shop.refreshShop();
		return;
	}
	
	Shop.unlock = function(shortName) {
		let boost = Shop.boost(shortName);
		boost.buyable = true;
		Shop.refreshShop();
	}

})(gameObjects.Game, gameObjects.Shop);