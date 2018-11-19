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
		if (!boost) return;
		
		if (!Game.hasCurrency(boost.getCost())) return;
		
		Game.spend(boost.getCost());
		boost.buy();
		Display.needsRepaintImmediate = true;
	}
	
	Shop.unlock = function(shortName) {
		let boost = Shop.boost(shortName);
		if (!boost) return;
		boost.unlock();
		Display.needsRepaintImmediate = true;
	}
	
	Shop.lock = function(shortName) {
		let boost = Shop.boost(shortName);
		if (!boost) return;
		boost.lock();
		Display.needsRepaintImmediate = true;
	}

	Shop.isAvailable = function(shortName) {
		let boost = Shop.boost(shortName);
		if (!boost) return false;

		return boost.isUnlocked() || boost.isBought();
	}

})(gameObjects.Game, gameObjects.Boosts, gameObjects.Friends, gameObjects.Display, gameObjects.Shop, gameObjects.Loot, gameObjects.Tabs);