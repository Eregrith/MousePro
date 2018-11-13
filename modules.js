/*
*
* Mouse Pro
*
* Game.js
*/

(function (Game, Display) {
	
	Game.modules = [];
	Game.module = function(shortName, gameModule) {
		Game.modules.push({shortName: shortName, gameModule: gameModule});
	}
	Game.getModule = function(shortName) {
		return Game.modules.filter(mod => mod.shortName == shortName)[0].gameModule;
	}

	Display.modules = [];
	Display.module = function(shortName, displayModule) {
		Display.modules.push({shortName: shortName, displayModule: displayModule});
	}
	Display.getModule = function(shortName) {
		return Display.modules.filter(mod => mod.shortName == shortName)[0].displayModule;
	}
    
})(gameObjects.Game, gameObjects.Display);