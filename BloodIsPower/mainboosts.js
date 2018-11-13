/*
*
* Mouse Pro
*
* BloodIsPower/Main Boosts.js
*/

(function (Game, Boosts, Display, Shop, Loot) {

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
		getDescription: function() {
			return 'Immediately gain ' + (Game.getModule('bip').getSacrificeRatio() * 100) + '%  of required MC xp for your current MC level '
				+ '(' + Display.beautify(Game.currency('MC').xpRequiredForNextLevel() * Game.getModule('bip').getSacrificeRatio()) + ')';
		},
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
			Game.getModule('bip').sacrifice(me, 'MC');
		},
		ephemeral: true,
		lifeDurationInTicks: 1000
	});
	Boosts.newBoost({
		name: 'MC Sacrifice',
		icon: 'moon',
		getDescription: function() {
			return 'Immediately gain ' + (Game.getModule('bip').getSacrificeRatio() * 100)+ '% of required MM xp for your current MM level '
				+ '(' + Display.beautify(Game.currency('MM').xpRequiredForNextLevel() * Game.getModule('bip').getSacrificeRatio()) + ')';
		},
		shortName: 'sacrifice-mc',
		cost: {
			levels: {
				MC: 1
			}
		},
		buy: function(me) {
			Game.getModule('bip').sacrifice(me, 'MC');
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
	Boosts.newBoost({
		name: 'True kriss',
		icon: 'truekriss',
		getDescription: function() { return 'A nice knife. I bet you can <i>harvest</i> things with it.'; },
		shortName: 'truekriss',
		cost: {
			levels: {
				MM: 22, 
				MC: 22
			}
		}
	});
	
})(gameObjects.Game, gameObjects.Boosts, gameObjects.Display, gameObjects.Shop, gameObjects.Loot);