/*
*
* Mouse Pro
*
* Game.js
*/

(function (Game, Currencies, Achievements, Friends, Shop, Stats) {
	
	EventNode = document.getElementById('eventNode');

	Currencies.newCurrency({
			name: 'Mouse Mover',
			shortName: 'MM',
			color: 'gray',
			iconTag: '<i class="fa fa-sun currency-icon"></i>',
			xpRequiredForNextLevel: 100,
			levelUp: function(me) {
				if (Shop.has('bootloader')) {
					let baseXp = 10;
					if (Shop.has('blutloader')) {
						baseXp *= Math.floor(Game.currency('blood').getXp());
						Shop.boost('bootloader').gainXP(1);
					}
					if (Shop.has('digitalsacrifice')) {
						baseXp *= 1 + Math.pow(1.1, Shop.boost('sacrifice-mm').getPower());
					}
					if (Shop.has('bloodbalancer') && Game.currency('MM').getLevel() < Game.currency('MC').getLevel()) {
						baseXp *= Math.floor(Game.currency('blood').getXp());
					}
					Game.acquireXp('MM', baseXp);
				}
				if (Shop.has('rxt')) {
					let xp = Shop.boost('rxt').bonusXp;
					if (Shop.has('rxtinjectordown')) {
						xp += me.saveableState.level;
					}
					if (Shop.has('outerglo')) {
						xp *= Friends.friend('aldo').getLevel();
					}
					if (Shop.has('rxtbloodinjector')) {
						xp *= 1 + Math.pow(1 + Shop.boost('rxtbloodinjector').getPower(), Shop.boost('sacrifice-mm').getPower());
						Shop.boost('rxtinjectordown').gainXP(1);
					}
					xp *= (Shop.has('addonenhancer') ? Shop.boost('addonenhancer').saveableState.power : 1);
					Game.acquireXp('MC', xp);
				}
			},
			xpGained: function(currency) {
				if (Shop.has('rmm') && currency.getXp() % 5 === 0)
					currency.setXp(currency.getXp() + Shop.boost('rmm').bonusXp * (Shop.has('addonenhancer') ? Shop.boost('addonenhancer').saveableState.power : 1));
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
					let baseXp = 10;
					if (Shop.has('blutloader')) {
						baseXp *= Math.floor(Game.currency('blood').getXp());
						Shop.boost('bootloader').gainXP(1);
					}
					if (Shop.has('digitalsacrifice')) {
						baseXp *= 1 + Math.pow(1.1, Shop.boost('sacrifice-mc').getPower());
					}
					if (Shop.has('bloodbalancer') && Game.currency('MC').getLevel() < Game.currency('MM').getLevel()) {
						baseXp *= Math.floor(Game.currency('blood').getXp());
					}
					Game.acquireXp('MC', baseXp);
				}
				if (Shop.has('rxt')) {
					let xp = Shop.boost('rxt').bonusXp;
					if (Shop.has('rxtinjectorup')) {
						xp += me.saveableState.level;
					}
					if (Shop.has('outerglo')) {
						xp *= Friends.friend('barnabeus').getLevel();
					}
					if (Shop.has('rxtbloodinjector')) {
						xp *= 1 + Math.pow(1 + Shop.boost('rxtbloodinjector').getPower(), Shop.boost('sacrifice-mc').getPower());
						Shop.boost('rxtinjectorup').gainXP(1);
					}
					xp *= (Shop.has('addonenhancer') ? Shop.boost('addonenhancer').saveableState.power : 1);
					Game.acquireXp('MM', xp);
				}
			},
			xpGained: function(currency) {
				if (Shop.has('rmc') && currency.getXp() % 5 === 0)
					currency.setXp(currency.getXp() + Shop.boost('rmc').bonusXp * (Shop.has('addonenhancer') ? Shop.boost('addonenhancer').saveableState.power : 1));
			}
		});

	Game.checkUnlocks = function() {
		let mm = Game.currency('MM');
		let mc = Game.currency('MC');
		let levelsUnlocks = [
			{ mm: 1, mc: 0, achievement: 'mover', boost: 'rmm' },
			{ mm: 0, mc: 1, achievement: 'clicker', boost: 'rmc' },
			{ mm: 1, mc: 1, achievement: 'jacky', boost: 'settings' },
			{ mm: 5, mc: 5, achievement: 'together', boost: 'rxt' },
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
		if (Friends.friend('aldo').saveableState.bought >= 5 && !Shop.has('rxtinjectordown')) {
			Shop.unlock('rxtinjectordown');
		}
		if (Friends.friend('barnabeus').saveableState.bought >= 5 && !Shop.has('rxtinjectorup')) {
			Shop.unlock('rxtinjectorup');
		}
		if ((mm.getXp() == 123 || mc.getXp() == 123) && !Achievements.has('statistician')) {
			Shop.unlock('stats');
			Achievements.gain('statistician');
		}
		if ((Shop.boost('sacrifice-mm').getPower() + Shop.boost('sacrifice-mc').getPower()) >= 5 && !Achievements.has('cutting')) {
			Shop.unlock('posters');
			Achievements.gain('cutting');
		}
		if ((Shop.boost('sacrifice-mm').getPower() + Shop.boost('sacrifice-mc').getPower()) >= 5 && !Achievements.has('cutting')) {
			Shop.unlock('posters');
			Achievements.gain('cutting');
		}
		if ((Friends.friend('aldo').saveableState.bought >= 10 || Friends.friend('barnabeus').saveableState.bought >= 10)
			 && !Achievements.has('talentpoint')) {
			Achievements.gain('talentpoint');
		}
		Game.modules.forEach((mod) => {
			mod.gameModule.checkUnlocks();
		});
	}
	
	Game.tick = function() {
		Friends.friends.forEach((friend) => Friends.tick(friend));
		Game.modules.filter(m => typeof(m.gameModule.tick) === typeof(Function)).forEach(m => m.gameModule.tick());
		Shop.boosts.filter(b => typeof(b.tick) === typeof(Function)).forEach((boost) => boost.tick());
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

	Game.ephemeralDeath = function(boost, manual) {
		let anchor = Shop.boost('anchor');
		anchor.saveableState.power++;
		if (anchor.saveableState.power >= 10 && !Achievements.has('ephemeral')) {
			Shop.unlock('anchor');
			Achievements.gain('ephemeral');
		}
		if (!manual && Shop.has('ottovonsacrifice') && Shop.boost('ottovonsacrifice').isActive()) {
			Shop.boost('ottovonsacrifice').gainXP(1);
			boost.unlock();
			boost.buy();
		}
		if (Shop.has('ratscavengers')) {
			let amount = 0.5;
			Game.acquireXp('blood', amount);
			Shop.boost('ratscavengers').gainXP(amount);
			Shop.boost('ratscavengers').saveableState.power++;
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
	
})(gameObjects.Game, gameObjects.Currencies, gameObjects.Achievements, gameObjects.Friends, gameObjects.Shop, gameObjects.Stats);