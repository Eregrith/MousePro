/*
*
* Mouse Pro
*
* Shop.js
*/

(function (Game, Boosts, Friends, Display, Shop, Loot, Tabs) {

	Boosts.newBoost({
		name: 'Mouse mover XT-PRO',
		icon: 'mouse-pointer',
		getDescription: function() { return 'This awesome mouse-addon gives you ' + this.bonusXp + ' MM XP every 5 points of MM XP' },
		shortName: 'xtpro',
		cost: {
			xp: {
				MM: 110,
				MC: 11
			}
		},
		bonusXp: 3
	});
	Boosts.newBoost({
		name: 'Mouse clicker DM-BLU',
		icon: 'mouse-pointer',
		getDescription: function() { return 'This awesome mouse-addon gives you ' + this.bonusXp + ' MC XP every 5 points of MC XP'; },
		shortName: 'dmblu',
		cost: {
			xp: {
				MM: 85,
				MC: 14
			}
		},
		bonusXp: 3
	});
	Boosts.newBoost({
		name: 'Mouse XP transfer ZB-GLO',
		icon: 'exchange-alt fa-rotate-90',
		getDescription: function() { return 'This awesome mouse-addon gives you ' + this.bonusXp + ' XP in the other proficiency when you level up one'; },
		shortName: 'zbglo',
		cost: {
			xp: {
				MM: 299,
				MC: 23
			}
		},
		bonusXp: 20
	});
	Boosts.newBoost({
		name: 'Settings',
		icon: 'cogs',
		getDescription: function() { return 'Let\'s tune this thing'; },
		shortName: 'settings',
		cost: {
			levels: {
				MM: 1,
				MC: 1
			}
		},
		buy: function () {
			Tabs.unlock('game');
			Tabs.unlock('settings');
			Tabs.toggleActiveTabTo('game');
		}
	});
	Boosts.newBoost({
		name: 'Addon Enhancer',
		icon: 'star',
		getDescription: function() {
			return 'This little device multiplies the effects of XT-PRO, DM-BLU and ZB-GLO addons by ' + this.getPower()
				+ (this.canBuy() ? '<br/>When bought, this effect doubles.' : '');
		},
		shortName: 'addonenhancer',
		cost: {
			levels: {
				MM: 10,
				MC: 10
			}
		},
		power: 1,
		buy: function (thisBoost) {
			thisBoost.saveableState.power *= 2;
			if (!Shop.has('friends'))
				Shop.unlock('friends');
		}
	});
	Boosts.newBoost({
		name: 'Friends',
		icon: 'user-friends',
		getDescription: function() { return this.bought ? 'Friends are AWESOOOME!!' : 'It\'s dangerous to go alone. Take this!'; },
		shortName: 'friends',
		cost: {
			levels: {
				MM: 10,
				MC: 10
			}
		},
		buy: function () {
			Friends.unlock('aldo');
		}
	});
	Boosts.newBoost({
		name: 'ZB-GLO Injector - Down',
		icon: 'arrow-down',
		getDescription: function() { return 'Mouse XP transfer ZB-GLO will give MC xp based on the MM level attained when it triggers.'; },
		shortName: 'zbgloinjectordown',
		cost: {
			levels: {
				MM: 15,
				MC: 15
			}
		}
	});
	Boosts.newBoost({
		name: 'ZB-GLO Injector - Up',
		icon: 'arrow-up',
		getDescription: function() { return 'Mouse XP transfer ZB-GLO will give MM xp based on the MC level attained when it triggers.'; },
		shortName: 'zbgloinjectorup',
		cost: {
			levels: {
				MM: 15,
				MC: 15
			}
		}
	});
	Boosts.newBoost({
		name: 'Bootloader',
		icon: 'download',
		getDescription: function() { return 'Kickstarts MM and MC by giving them 10 xp when they level up'; },
		shortName: 'bootloader',
		cost: {
			levels: {
				MM: 2,
				MC: 2
			}
		}
	});
	Boosts.newBoost({
		name: 'Vitrine',
		icon: 'tv',
		getDescription: function() { return 'A nice place to show off what you got'; },
		shortName: 'vitrine',
		cost: {
			levels: {
				MM: 5,
				MC: 5
			}
		},
		buy: function() {
			Tabs.unlock('achievements');
		}
	});
	Boosts.newBoost({
		name: 'Outer GLO',
		icon: 'lightbulb outer-glow fa-lighter',
		getDescription: function() { return 'Multiplies the effect of ZB-GLO by the corresponding friend\'s level. Can only be bought when MC xp is even.'; },
		shortName: 'outerglo',
		cost: {
			levels: {
				MM: 20,
				MC: 20
			}
		},
		canBuy: function() {
			return (Game.currency('MC').saveableState.xp % 2 == 0);
		}
	});
	Boosts.newBoost({
		name: 'Stats',
		icon: 'chart-bar',
		getDescription: function() { return 'You know numbers. Here you can look at them'; },
		shortName: 'stats',
		cost: {
			xp: {
				MM: 123,
				MC: 123
			}
		},
		buy: function() {
			Tabs.unlock('stats');
		}
	});
	Boosts.newBoost({
		name: 'Sacrificial Kriss',
		icon: 'kriss',
		getDescription: function() { return 'This might come in handy... maybe? What would you buy a sacrificial knife for anyway?'; },
		shortName: 'kriss',
		cost: {
			levels: {
				MM: 12,
				MC: 14
			}
		},
		buy: function() {
			Shop.unlock('sacrifice-mm');
		}
	});
	Boosts.newBoost({
		name: 'MM Sacrifice',
		icon: 'sun',
		getDescription: function() { return 'Immediately gain ' + (this.getSacrificeRatio() * 100) + '%  of required MC xp for your current MC level (' + Display.beautify(Game.currency('MC').xpRequiredForNextLevel() * this.getSacrificeRatio()) + ')'; },
		shortName: 'sacrifice-mm',
		cost: {
			levels: {
				MM: 1
			}
		},
		getSacrificeRatio: function() {
			let sacrificeRatio = 0.5;
			let knifeparts = [ 'serratedblade', 'rubypommel',  'dragongrip', 'diamondbladetip', 'cheatersscabbard' ];
			knifeparts.forEach((part) => {
				if (Shop.has(part)) sacrificeRatio += 0.1;
			});
			sacrificeRatio = sacrificeRatio.toFixed(2);
			return sacrificeRatio;
		},
		buy: function(me) {
			me.saveableState.power++;
			let sacrificeRatio = 0.5;
			let knifeparts = [ 'serratedblade', 'rubypommel',  'dragongrip', 'diamondbladetip', 'cheatersscabbard' ];
			knifeparts.forEach((part) => {
				if (Shop.has(part)) sacrificeRatio += 0.1;
			});
			sacrificeRatio = sacrificeRatio.toFixed(2);
			Game.acquireXp('MC', Game.currency('MC').xpRequiredForNextLevel() * sacrificeRatio);
			Display.notify('You won ' + (sacrificeRatio * 100) + '% required MC xp', 'generic');
			Shop.lock('sacrifice-mm');
			Loot.tryLootCategory('knifepart');
		},
		ephemeral: true,
		lifeDurationInTicks: 1000
	});
	Boosts.newBoost({
		name: 'MC Sacrifice',
		icon: 'moon',
		getDescription: function() { return 'Immediately gain ' + (this.getSacrificeRatio() * 100)+ '% of required MM xp for your current MM level (' + Display.beautify(Game.currency('MM').xpRequiredForNextLevel() * this.getSacrificeRatio()) + ')'; },
		shortName: 'sacrifice-mc',
		cost: {
			levels: {
				MC: 1
			}
		},
		getSacrificeRatio: function() {
			let sacrificeRatio = 0.5;
			let knifeparts = [ 'serratedblade', 'rubypommel',  'dragongrip', 'diamondbladetip', 'cheatersscabbard' ];
			knifeparts.forEach((part) => {
				if (Shop.has(part)) sacrificeRatio += 0.1;
			});
			sacrificeRatio = sacrificeRatio.toFixed(2);
			return sacrificeRatio;
		},
		buy: function(me) {
			me.saveableState.power++;
			let sacrificeRatio = this.getSacrificeRatio();
			Game.acquireXp('MM', Game.currency('MM').xpRequiredForNextLevel() * sacrificeRatio);
			Display.notify('You won ' + (sacrificeRatio * 100) + '% required MM xp', 'generic');
			Shop.lock('sacrifice-mc');
			Loot.tryLootCategory('knifepart');
		},
		ephemeral: true,
		lifeDurationInTicks: 1000
	});
	Boosts.newBoost({
		name: 'Recruitment posters',
		icon: 'portrait',
		getDescription: function() { return 'This will help you find lambs to slaughter. Doubles the chance to have a ready sacrifice.'; },
		shortName: 'posters',
		cost: {
			levels: {
				MM: 5, 
				MC: 5
			}
		}
	});
	Boosts.newBoost({
		name: 'Serrated blade',
		icon: 'serratedblade',
		getDescription: function() { return 'A part of a nice knife. Your sacrifices yield +10% of xp required for next level.'; },
		shortName: 'serratedblade',
		cost: {
			levels: {
				MM: 18, 
				MC: 18
			}
		}
	});
	Boosts.newBoost({
		name: 'Ruby pommel',
		icon: 'rubypommel',
		getDescription: function() { return 'A part of a nice knife. Your sacrifices yield +10% of xp required for next level.'; },
		shortName: 'rubypommel',
		cost: {
			levels: {
				MM: 18, 
				MC: 18
			}
		}
	});
	Boosts.newBoost({
		name: 'Sculpted Dragon Grip',
		icon: 'dragongrip',
		getDescription: function() { return 'A part of a nice knife. Your sacrifices yield +10% of xp required for next level.'; },
		shortName: 'dragongrip',
		cost: {
			levels: {
				MM: 18, 
				MC: 18
			}
		}
	});
	Boosts.newBoost({
		name: 'Diamond Blade-Tip',
		icon: 'diamondbladetip',
		getDescription: function() { return 'A part of a nice knife. Your sacrifices yield +10% of xp required for next level.'; },
		shortName: 'diamondbladetip',
		cost: {
			levels: {
				MM: 18, 
				MC: 18
			}
		}
	});
	Boosts.newBoost({
		name: 'Cheater\'s scabbard',
		icon: 'cheatersscabbard',
		getDescription: function() { return 'A part of a nice knife. Your sacrifices yield +10% of xp required for next level.'; },
		shortName: 'cheatersscabbard',
		cost: {
			levels: {
				MM: 18, 
				MC: 18
			}
		}
	});
	
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