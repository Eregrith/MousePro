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
			description: 'Gives you one MM XP every five points of MM XP',
			shortName: 'xtpro',
			cost: {
				MM: 110,
				MC: 11
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