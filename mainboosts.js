/*
*
* Mouse Pro
*
* Main Boosts.js
*/

(function (Game, Display, Boosts, Friends, Shop, Tabs) {

	Boosts.newBoost({
		name: 'Redundant Mouse Mover',
		icon: 'mouse-pointer',
		getDescription: function() { return 'This addon gives you ' + this.bonusXp + ' MM XP when MM XP ends in 0 or 5' },
		shortName: 'rmm',
		cost: {
			xp: {
				MM: 110,
				MC: 11
			}
		},
		bonusXp: 3
	});
	Boosts.newBoost({
		name: 'Redundant Mouse clicker',
		icon: 'mouse-pointer',
		getDescription: function() { return 'This addon gives you ' + this.bonusXp + ' MC XP when MC XP ends in 0 or 5'; },
		shortName: 'rmc',
		cost: {
			xp: {
				MM: 85,
				MC: 14
			}
		},
		bonusXp: 3
	});
	Boosts.newBoost({
		name: 'Redundant XP Transfer',
		icon: 'exchange-alt fa-rotate-90',
		getDescription: function() { return 'This addon gives you ' + this.bonusXp + ' XP in the other proficiency when you level up one'; },
		shortName: 'rxt',
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
			Tabs.unlock('log');
			Tabs.toggleActiveTabTo('game');
		}
	});
	Boosts.newBoost({
		name: 'Addon Enhancer',
		icon: 'star',
		getDescription: function() {
			return 'Multiplies the effects of Redundant Mouse Mover, Redundant Mouse Clicker and Redundant XP Transfer addons by '
				+ (this.isUnlocked() ? this.getPower() * 2 :  this.getPower());
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
		}
	});
	Boosts.newBoost({
		name: 'RXT Injector - Down',
		icon: 'arrow-down',
		getDescription: function() { return 'Redundant XP Transfer will give MC XP based on the MM level attained when it triggers.'; },
		shortName: 'rxtinjectordown',
		hasXP: true,
		xpNeededToBeFull: 10,
		xpBarColor: 'red',
		isFullXP: function (me) {
			if (!Shop.has('blutloader')) {
				Shop.unlock('blutloader');
			} else {
				me.isFullXP = () => {};
			}
		},
		cost: {
			levels: {
				MM: 15,
				MC: 15
			}
		}
	});
	Boosts.newBoost({
		name: 'RXT Injector - Up',
		icon: 'arrow-up',
		getDescription: function() { return 'Redundant XP Transfer will give MM XP based on the MC level attained when it triggers.'; },
		shortName: 'rxtinjectorup',
		hasXP: true,
		xpNeededToBeFull: 10,
		xpBarColor: 'red',
		isFullXP: function (me) {
			if (!Shop.has('blutloader')) {
				Shop.unlock('blutloader');
			} else {
				me.isFullXP = () => {};
			}
		},
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
		getDescription: function() { return 'Kickstarts MM with '+Display.beautify(this.getMMXp()) +' xp and MC with '+Display.beautify(this.getMCXp()) + ' xp when they level up'; },
		shortName: 'bootloader',
		hasXP: true,
		xpNeededToBeFull: 10,
		xpBarColor: 'red',
		getMMXp: function() {
			let baseXp = 10;
			if (Shop.has('blutloader')){
				baseXp *= Math.floor(Game.currency('blood').getXp());
			}
			if (Shop.has('digitalsacrifice')) {
				baseXp *= 1 + Math.pow(1.1, Shop.boost('sacrifice-mm').getPower());
			}
			return baseXp;
		},
		getMCXp: function() {
			let baseXp = 10;
			if (Shop.has('blutloader')){
				baseXp *= Math.floor(Game.currency('blood').getXp());
			}
			if (Shop.has('digitalsacrifice')) {
				baseXp *= 1 + Math.pow(1.1, Shop.boost('sacrifice-mc').getPower());
			}
			return baseXp;
		},
		isFullXP: function(me) {
			if (!Shop.has('digitalsacrifice')) {
				Shop.unlock('digitalsacrifice');
			} else {
				me.isFullXP = () => {};
			}
		},
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
		getDescription: function() { return 'A nice place to show off what achievements you have.'; },
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
		name: 'Outer glow',
		icon: 'lightbulb outer-glow fa-lighter',
		getDescription: function() { return 'Multiplies the effect of Redundant XP Transfer by the corresponding friend\'s level. Can only be bought when MC xp is even.'; },
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
		getDescription: function() { return 'You know numbers. Here you can look at them.'; },
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
		name: 'Ephemeral Anchor',
		icon: 'anchor',
		isActivable: true,
		getDescription: function() {
			let desc = 'Ephemeral boosts live for twice as long before disappearing.'; 
			if (!this.isBought()) {
				desc += '<br/>Toggleable on/off.';
			} else if (this.isActive()) {
				desc += '<div class="btn" onclick="gameObjects.Game.getModule(\'bip\').toggleBoost(\'anchor\')">Turn off</div>';
			} else {
				desc += '<div class="btn" onclick="gameObjects.Game.getModule(\'bip\').toggleBoost(\'anchor\')">Turn on</div>'
			}
			return desc;
		},
		shortName: 'anchor',
		cost: {
			xp: {
				MM: 1024,
				MC: 1024
			}
		}
    });
    
})(gameObjects.Game, gameObjects.Display, gameObjects.Boosts, gameObjects.Friends, gameObjects.Shop, gameObjects.Tabs);
