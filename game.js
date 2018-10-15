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
				if (Shop.has('zbglo')) {
					let xp = 5;
					if (Shop.has('zbgloinjectordown')) {
						xp += me.saveableState.level;
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
				if (Shop.has('zbglo')) {
					let xp = 5;
					if (Shop.has('zbgloinjectorup')) {
						xp += me.saveableState.level;
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
		if (Friends.friend('aldo').saveableState.bought >= 5 && !Shop.has('zbgloinjectordown')) {
			Shop.unlock('zbgloinjectordown');
		}
		if (Friends.friend('barnabeus').saveableState.bought >= 5 && !Shop.has('zbgloinjectorup')) {
			Shop.unlock('zbgloinjectorup');
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