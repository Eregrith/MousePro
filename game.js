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
			iconTag: '<i class="fa fa-sun currency-icon"></i>',
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
			iconTag: '<i class="fa fa-moon currency-icon"></i>',
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
		let mm = Game.currency('MM');
		let mc = Game.currency('MC');
		let levelsUnlocks = [
			{ mm: 1, mc: 0, achievement: 'mover', boost: 'xtpro' },
			{ mm: 0, mc: 1, achievement: 'clicker', boost: 'dmblu' },
			{ mm: 1, mc: 1, achievement: 'jacky', boost: 'settings' },
			{ mm: 5, mc: 5, achievement: 'together', boost: 'zbglo' },
			{ mm: 10, mc: 10, achievement: '42', boost: 'addonenhancer' },
			{ mm: 15, mc: 15, achievement: 'marignan', boost: 'addonenhancer', friend: 'barnabeus'},
			{ mm: 20, mc: 20, achievement: 'fnafMaster', boost: 'kriss' },
			{ mm: 25, mc: 25, achievement: 'quartercentury', boost: 'addonenhancer' },
			{ mm: 30, mc: 30, achievement: 'glowing', boost: 'outerglo' },
		];
		levelsUnlocks.forEach((levelUnlock) => {
			if (mm.getLevel() >= levelUnlock.mm
				&& mc.getLevel() >= levelUnlock.mc
				&& !Achievements.has(levelUnlock.achievement)) {
				Shop.unlock(levelUnlock.boost);
				Achievements.gain(levelUnlock.achievement);
				if (levelUnlock.friend !== undefined) {
					Friends.unlock(levelUnlock.friend);
				}
			}
		});
		if (Friends.friend('aldo').saveableState.bought >= 5 && !Shop.has('zbgloinjectordown')) {
			Shop.unlock('zbgloinjectordown');
		}
		if (Friends.friend('barnabeus').saveableState.bought >= 5 && !Shop.has('zbgloinjectorup')) {
			Shop.unlock('zbgloinjectorup');
		}
		if ((mm.getXp() == 123 || mc.getXp() == 123) && !Achievements.has('statistician')) {
			Shop.unlock('stats');
			Achievements.gain('statistician');
		}
		if ((Shop.boost('sacrifice-mm').getPower() + Shop.boost('sacrifice-mc').getPower()) >= 5 && !Achievements.has('cutting')) {
			Shop.unlock('posters');
			Achievements.gain('cutting');
		}
	}
	
	Game.tick = function() {
		Friends.friends.forEach((friend) => Friends.tick(friend));
		if (Shop.has('kriss') && !Shop.boost('sacrifice-mc').isUnlocked() && !Shop.boost('sacrifice-mm').isUnlocked() )
		{
			let sacrificeChance = 0.0005;
			if (Shop.has('posters'))
				sacrificeChance *= 2;
			if (Math.random() < sacrificeChance) {
				if (Math.random() < 0.5)
					Shop.unlock('sacrifice-mm');
				else
					Shop.unlock('sacrifice-mc');
			}
		}
		Shop.boosts.filter(b => b.tick != undefined).forEach((boost) => boost.tick());
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
		Game.checkUnlocks();
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