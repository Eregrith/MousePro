/*
*
* Mouse Pro
*
* Game.js
*/

(function (Game, Currencies, Achievements, Friends, Shop, Save, Tabs) {
	
	EventNode = document.getElementById('eventNode');

	Currencies.newCurrency({
			name: 'Mouse Mover',
			shortName: 'MM',
			color: 'gray',
			xpRequiredForNextLevel: 100,
			levelUp: function(me) {
				if (Shop.has('bootloader')) {
					Game.acquireXp('MM', 10);
				}
				if (Shop.has('zbglo')) {
					let xp = 5;
					if (Shop.has('zbgloinjectordown')) {
						xp += me.saveableState.level;
					}
					if (Shop.has('outerglo')) {
						xp *= Friends.friend('aldo').getLevel();
					}
					xp *= (Shop.has('addonenhancer') ? Shop.boost('addonenhancer').saveableState.power : 1);
					Game.acquireXp('MC', xp);
				}
			},
			xpGained: function(currency) {
				if (Shop.has('xtpro') && currency.getXp() % 5 === 0)
					currency.setXp(currency.getXp() + Shop.boost('xtpro').bonusXp * (Shop.has('addonenhancer') ? Shop.boost('addonenhancer').saveableState.power : 1));
			}
		});
	Currencies.newCurrency({
			name: 'Mouse Clicker',
			shortName: 'MC',
			color: 'green',
			xpRequiredForNextLevel: 10,
			levelUp: function(me) {
				if (Shop.has('bootloader')) {
					Game.acquireXp('MC', 10);
				}
				if (Shop.has('zbglo')) {
					let xp = 5;
					if (Shop.has('zbgloinjectorup')) {
						xp += me.saveableState.level;
					}
					if (Shop.has('outerglo')) {
						xp *= Friends.friend('barnabeus').getLevel();
					}
					xp *= (Shop.has('addonenhancer') ? Shop.boost('addonenhancer').saveableState.power : 1);
					Game.acquireXp('MM', xp);
				}
			},
			xpGained: function(currency) {
				if (Shop.has('dmblu') && currency.getXp() % 5 === 0)
					currency.setXp(currency.getXp() + Shop.boost('dmblu').bonusXp * (Shop.has('addonenhancer') ? Shop.boost('addonenhancer').saveableState.power : 1));
			}
		});

	Game.checkUnlocks = function() {
		if (Game.currency('MM').getLevel() >= 1 && !Achievements.has('mover')) {
			Shop.unlock('xtpro');
			Achievements.gain('mover');
		}
		if (Game.currency('MM').getLevel() >= 1 && Game.currency('MC').getLevel() >= 1 && !Achievements.has('jacky')) {
			Shop.unlock('settings');
			Achievements.gain('jacky');
		}
		if (Game.currency('MC').getLevel() >= 1 && !Achievements.has('clicker')) {
			Shop.unlock('dmblu');
			Achievements.gain('clicker');
		}
		if (Game.currency('MM').getLevel() >= 5 && Game.currency('MC').getLevel() >= 5 && !Achievements.has('together')) {
			Shop.unlock('zbglo');
			Achievements.gain('together');
		}
		if (Game.currency('MM').getLevel() >= 10 && Game.currency('MC').getLevel() >= 10 && !Achievements.has('42')) {
			Shop.unlock('addonenhancer');
			Achievements.gain('42');
		}
		if (Game.currency('MM').getLevel() >= 15 && Game.currency('MC').getLevel() >= 15 && !Achievements.has('marignan')) {
			Shop.unlock('addonenhancer');
			Friends.unlock('barnabeus');
			Achievements.gain('marignan');
		}
		if (Game.currency('MM').getLevel() >= 25 && Game.currency('MC').getLevel() >= 25 && !Achievements.has('quartercentury')) {
			Shop.unlock('addonenhancer');
			Achievements.gain('quartercentury');
		}
		if (Friends.friend('aldo').saveableState.bought >= 5 && !Shop.has('zbgloinjectordown')) {
			Shop.unlock('zbgloinjectordown');
		}
		if (Friends.friend('barnabeus').saveableState.bought >= 5 && !Shop.has('zbgloinjectorup')) {
			Shop.unlock('zbgloinjectorup');
		}
		if (Game.currency('MM').getLevel() >= 30 && Game.currency('MC').getLevel() >= 30 && !Achievements.has('glowing')) {
			Shop.unlock('outerglo');
			Achievements.gain('glowing');
		}
		if ((Game.currency('MM').getXp() == 123 || Game.currency('MC').getXp() == 123) && !Achievements.has('statistician')) {
			Shop.unlock('stats');
			Achievements.gain('statistician');
		}
	}
	
	Game.tick = function() {
		for (f in Friends.friends) {
			if (Friends.friends.hasOwnProperty(f)) {
				Friends.tick(Friends.friends[f]);
			}
		}
	}

	Game.currency = function(currencyShortName) {
		return Game.currencies.filter(c => c.shortName == currencyShortName)[0];
	}
	
	Game.currencyProgressPercent = function(currencyShortName) {
		let currency = Game.currency(currencyShortName);
		return currency.xpProgressPercent();
	}
	
	Game.acquireXp = function(currencyShortName, xpAmount) {
		let currency = Game.currency(currencyShortName);
		currency.acquireXp(xpAmount);
		//Game.checkUnlocks();
	}
	
	Game.hasCurrency = function(costs) {
		for (let currency in costs.xp) {
			if (costs.xp.hasOwnProperty(currency)) {
				let cost = costs.xp[currency];
				if (Game.currency(currency).getXp() < cost) return false;
			}
		}
		for (let currency in costs.levels) {
			if (costs.levels.hasOwnProperty(currency)) {
				let cost = costs.levels[currency];
				if (Game.currency(currency).saveableState.level < cost) return false;
			}
		}
		return true;
	}
	
	Game.spend = function(costs) {
		for (let currency in costs.xp) {
			if (costs.xp.hasOwnProperty(currency)) {
				let cost = costs.xp[currency];
				let c = Game.currency(currency);
				c.setXp(c.getXp() - cost);
			}
		}
		for (let currencyShortName in costs.levels) {
			if (costs.levels.hasOwnProperty(currencyShortName)) {
				let cost = costs.levels[currencyShortName];
				let currency = Game.currency(currencyShortName);
				currency.levelDown(cost);
			}
		}
	}
	
	Game.lastMouseDown = {};
	
	Game.onclick = function (e) {
		Game.lastMouseDown = { x: e.clientX, y: e.clientY };
		Game.acquireXp('MC', 1);
	}
	
	Game.onmousemove = function(e) {
		if ( e.clientX !== Game.lastMouseDown.x || e.clientY !== Game.lastMouseDown.y) {
			Game.acquireXp('MM', 1);
		}
	}
	
})(gameObjects.Game, gameObjects.Currencies, gameObjects.Achievements, gameObjects.Friends, gameObjects.Shop);