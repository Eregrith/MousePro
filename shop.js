/*
*
* Mouse Pro
*
* Shop.js
*/

(function (Game, Boosts, Friends, Display, Shop, Loot, Tabs) {

	Shop.boost = function(shortName) {
		return Shop.boosts.filter(b => b.shortName == shortName)[0];
	}
	
	Shop.has = function(shortName) {
		let boost = Shop.boost(shortName);
		if (!boost) return false;
		return boost.isBought();
	}
	
	Shop.buy = function(shortName) {
		let boost = Shop.boost(shortName);
		if (!boost) { console.log("no boost with shortname", shortName); return; }
		
		if (!Game.hasCurrency(boost.getCost())) { console.log("not enough currency for boost", boost); return; }
		
		Game.spend(boost.getCost());
		boost.buy();
	}
	
	Shop.unlock = function(shortName) {
		let boost = Shop.boost(shortName);
		if (!boost) return;
		boost.unlock();
	}
	
	Shop.lock = function(shortName) {
		let boost = Shop.boost(shortName);
		if (!boost) return;
		boost.lock();
	}

	Shop.isAvailable = function(shortName) {
		let boost = Shop.boost(shortName);
		if (!boost) return false;

		return boost.isUnlocked() || boost.isBought();
	}

	Shop.isFullXP = function(shortName) {
		let boost = Shop.boost(shortName);
		if (!boost) return false;
		if (!boost.hasXP) return false;

		return boost.saveableState.xpGained >= boost.xpNeededToBeFull;
	}

})(gameObjects.Game, gameObjects.Boosts, gameObjects.Friends, gameObjects.Display, gameObjects.Shop, gameObjects.Loot, gameObjects.Tabs);