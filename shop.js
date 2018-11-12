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
	
	Shop.lock = function(shortName) {
		let boost = Shop.boost(shortName);
		boost.lock();
		Display.needsRepaintImmediate = true;
	}

})(gameObjects.Game, gameObjects.Boosts, gameObjects.Friends, gameObjects.Display, gameObjects.Shop, gameObjects.Loot, gameObjects.Tabs);